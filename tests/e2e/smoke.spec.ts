import { expect, test, type Page } from '@playwright/test';

/** Every same-site page reachable from the home page, following links. */
async function crawl(page: Page): Promise<string[]> {
  const seen = new Set<string>(['/']);
  const queue = ['/'];
  while (queue.length > 0) {
    const path = queue.shift() as string;
    await page.goto(path);
    const hrefs = await page.locator('a[href]').evaluateAll((links) =>
      links.map((a) => (a as HTMLAnchorElement).href),
    );
    for (const href of hrefs) {
      const url = new URL(href);
      if (url.origin !== new URL(page.url()).origin) continue;
      const next = url.pathname;
      if (!seen.has(next)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return [...seen];
}

test('every internal link leads to a page that loads', async ({ page, request }) => {
  const paths = await crawl(page);
  for (const path of paths) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
  }
});

test('the home page loads without console errors, with one h1 and the install line', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  const response = await page.goto('/');
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByText('/plugin install pro-web-design-suite', { exact: false })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

// WCAG 1.4.10: 320 CSS px is 1280 px at 400% zoom. The install line's <pre> once set the
// whole page's minimum width (721 px), because its grid item could not shrink below it.
test('the home page reflows to 320 px without scrolling sideways', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');
  const { scroll, client } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(scroll).toBeLessThanOrEqual(client);
  // The command scrolls inside its own box instead.
  const install = page.locator('pre');
  expect(await install.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
});

// The starter's base.css left `pre > code` to the UA's `font-family: monospace` (Courier New).
test('code blocks are set in the mono token, not the browser default', async ({ page }) => {
  await page.goto('/');
  const family = await page.locator('pre code').evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toMatch(/^"JetBrains Mono"/);
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.fonts.check('1em "JetBrains Mono"'))).toBe(true);
});

test('the skip link is the first stop and moves focus to the content', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('the footer states the gates claim and links to their green runs', async ({ page }) => {
  await page.goto('/');
  const claim = page.getByRole('link', { name: 'This site passes its own gates' });
  await expect(claim).toHaveAttribute('href', /actions\/workflows\/design-gates\.yml\?query=branch%3Amain\+is%3Asuccess$/);
});

test('an unknown address gets the 404 page with a 404 status', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("There's no page here");
});

test('a non-production build keeps crawlers out', async ({ request, page }) => {
  const robots = await (await request.get('/robots.txt')).text();
  expect(robots).toContain('Disallow: /');
  await page.goto('/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});

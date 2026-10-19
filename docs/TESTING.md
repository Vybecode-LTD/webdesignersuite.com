# Testing

Every check below runs in CI on each pull request and on `main`. Run them locally before pushing: Actions minutes are shared.

## Frameworks

| Layer | Tool | Version | Where |
|---|---|---|---|
| Types | `astro check` (`@astrojs/check`, TypeScript strictest) | 0.9.10, TS 6.0.3 | `npm run check` |
| Unit | Vitest | 5.0.4 | `tests/unit/`, `npm test` |
| Built output | Vitest, reading `dist/` | 5.0.4 | `tests/dist/`, `npm run test:dist` after `npm run build` |
| Smoke (browser) | Playwright, Chromium | 1.64.0 | `tests/e2e/`, `npm run test:e2e` (it serves `dist/` with `astro preview`) |
| Design audit | the suite's `audit_design.py --strict` (Laws 1 to 6, `.astro` files included) | vendored, 3.6.0 | `scripts/`, `design-gates.yml` |
| Accessibility, static and runtime | `a11y_static.py --strict`; `a11y_runtime.mjs` with axe-core 4.14.0 | vendored | `design-gates.yml` |
| Performance, static and runtime | `perf_audit.py` (built-in budgets); `measure_vitals.mjs`, 7 runs, Lighthouse throttling | vendored | `design-gates.yml` |
| Contrast | `check_roles.py`: every role pair, light, dark and `.inverse` | vendored | `ci.yml` |

`scripts/` is written by the plugin's `/install-gate` (`scripts/design-gates.json` lists each file and its SHA-256). Upgrade
it by running the command again, never by hand. `design-gates.yml` is the plugin's too; the site's own checks are `ci.yml`.

## Running everything locally

```bash
npm ci
npx playwright install chromium      # once per Playwright version
npm run check && npm test && npm run build && npm run test:dist && npm run test:e2e
npm run gates                        # the static gates, after the build
```

The runtime gates need the build served:

```bash
npx serve dist -l 8080
node scripts/a11y_runtime.mjs --url http://127.0.0.1:8080/
node scripts/measure_vitals.mjs http://127.0.0.1:8080/ --runs 7 --throttle lighthouse
```

## Regression tests

Each fix gets a test that failed before it. So far:

| Test | Failed before with |
|---|---|
| e2e "the home page reflows to 320 px without scrolling sideways" | `scrollWidth` 721 against 320 |
| e2e "code blocks are set in the mono token, not the browser default" | `font-family: monospace` |
| dist "has one h1, a description and a canonical URL" (404's description) | a 34-character description |

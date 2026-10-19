import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

// Reads the built site in dist/: run `npm run build` first (`npm run test:dist` does both in CI).
const dist = join(process.cwd(), 'dist');

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

/** The layer order index.css states, the one place it is decided. */
function declaredOrder(): string[] {
  const css = readFileSync(join(process.cwd(), 'src/styles/index.css'), 'utf8');
  const statement = /^@layer\s+([^;{]+);/m.exec(css);
  if (!statement?.[1]) throw new Error('index.css has no @layer order statement');
  return statement[1].split(',').map((name) => name.trim());
}

/** Each top-level layer name, in the order the stylesheets first mention it. */
function firstMentions(css: string): string[] {
  const seen: string[] = [];
  for (const match of css.matchAll(/@layer\s+([a-z][a-z0-9-]*(?:\s*,\s*[a-z][a-z0-9-]*)*)\s*[;{]/g)) {
    for (const name of (match[1] ?? '').split(',').map((n) => n.trim())) {
      if (!seen.includes(name)) seen.push(name);
    }
  }
  return seen;
}

const pages = htmlFiles(dist);
const stylesheets = readdirSync(join(dist, '_astro')).filter((name) => name.endsWith('.css'));

describe('the built site', () => {
  it('has pages to check', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  // index.css tells perf_audit to skip its @imports because Vite inlines them; this holds it to that.
  it.each(stylesheets)('ships %s with every @import inlined', (name) => {
    expect(readFileSync(join(dist, '_astro', name), 'utf8')).not.toMatch(/@import\b/);
  });

  describe.each(pages.map((path) => [relative(dist, path).replaceAll('\\', '/'), path]))('%s', (_name, path) => {
    const html = readFileSync(path, 'utf8');

    it('states the layers in index.css order before any rule can land in them', () => {
      const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1] ?? '');
      expect(sheets.length).toBeGreaterThan(0);
      const css = sheets.map((href) => readFileSync(join(dist, href), 'utf8')).join('\n');
      const declared = declaredOrder();
      expect(firstMentions(css).filter((name) => declared.includes(name))).toEqual(declared);
    });

    it('has no inline style or script, so the CSP needs no unsafe-inline', () => {
      expect(html).not.toMatch(/<style[\s>]/);
      expect(html).not.toMatch(/<script(?![^>]*\bsrc=)[^>]*>/);
      expect(html).not.toMatch(/\sstyle="/);
    });

    it('has one h1, a description and a canonical URL on the real domain', () => {
      expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
      expect(html).toMatch(/<meta name="description" content="[^"]{50,}"/);
      expect(html).toMatch(/<link rel="canonical" href="https:\/\/webdesignersuite\.com\/[^"]*"/);
      expect(html).not.toMatch(/rel="canonical" href="[^"]*\.html"/);
    });
  });
});

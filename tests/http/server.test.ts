import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { describe, expect, it } from 'vitest';

// The Caddyfile's rules, checked over HTTP against a running server: the image in CI
// (SITE_URL=http://127.0.0.1:8080) or staging (its railway.app URL). `npm run test:http`.
const base = process.env['SITE_URL'];
if (!base) throw new Error('Set SITE_URL to the server to test, e.g. http://127.0.0.1:8080');

interface Reply {
  status: number;
  headers: Record<string, string | string[] | undefined>;
  body: string;
}

/** A raw request: no redirects followed, and a Host header fetch() may not set. */
function get(path: string, headers: Record<string, string> = {}): Promise<Reply> {
  const url = new URL(path, base);
  const send = url.protocol === 'https:' ? httpsRequest : httpRequest;
  return new Promise((resolve, reject) => {
    const req = send(url, { method: 'GET', headers }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () =>
        resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }),
      );
    });
    req.on('error', reject);
    req.setTimeout(15_000, () => req.destroy(new Error(`timed out: ${url.href}`)));
    req.end();
  });
}

function header(reply: Reply, name: string): string {
  const value = reply.headers[name.toLowerCase()];
  return Array.isArray(value) ? value.join(', ') : (value ?? '');
}

describe(`the server at ${base}`, () => {
  it('answers the health check', async () => {
    const reply = await get('/healthz');
    expect(reply.status).toBe(200);
    expect(reply.body).toBe('ok');
  });

  it('serves the home page with every security header', async () => {
    const reply = await get('/');
    expect(reply.status).toBe(200);
    expect(header(reply, 'content-type')).toMatch(/^text\/html/);
    const csp = header(reply, 'content-security-policy');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain('unsafe-inline');
    expect(header(reply, 'strict-transport-security')).toMatch(/max-age=31536000/);
    expect(header(reply, 'x-content-type-options')).toBe('nosniff');
    expect(header(reply, 'referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(header(reply, 'cache-control')).toContain('must-revalidate');
    expect(header(reply, 'server')).not.toMatch(/caddy/i);
  });

  it('caches hashed assets for a year, as immutable', async () => {
    const home = await get('/');
    const css = /href="(\/_astro\/[^"]+\.css)"/.exec(home.body)?.[1];
    expect(css).toBeDefined();
    const reply = await get(css as string);
    expect(reply.status).toBe(200);
    expect(header(reply, 'cache-control')).toBe('public, max-age=31536000, immutable');
  });

  it('compresses text', async () => {
    const reply = await get('/', { 'Accept-Encoding': 'gzip' });
    expect(header(reply, 'content-encoding')).toBe('gzip');
  });

  it.each([
    ['/index.html', '/'],
    ['/404.html', '/404'],
  ])('redirects %s to %s', async (from, to) => {
    const reply = await get(from);
    expect(reply.status).toBe(308);
    expect(header(reply, 'location')).toBe(to);
  });

  // Through Railway's edge a request reaches Caddy only for a domain attached to the service, and a
  // railway.app URL's certificate can't carry a www.webdesignersuite.com Host. So this runs against the
  // image (CI) and production, where both domains are attached; on staging it is skipped, not passed.
  it.skipIf(new URL(base).hostname.endsWith('.up.railway.app'))('redirects www to the bare domain, keeping the path', async () => {
    const reply = await get('/install?x=1', { Host: 'www.webdesignersuite.com' });
    expect(reply.status).toBe(308);
    expect(header(reply, 'location')).toBe('https://webdesignersuite.com/install?x=1');
  });

  it('answers an unknown address with the 404 page, its status and the headers', async () => {
    const reply = await get('/no-such-page');
    expect(reply.status).toBe(404);
    expect(reply.body).toContain("There's no page here");
    expect(header(reply, 'content-security-policy')).toContain("default-src 'self'");
    expect(header(reply, 'cache-control')).toContain('must-revalidate');
  });

  it('serves robots.txt and the sitemap', async () => {
    const robots = await get('/robots.txt');
    expect(robots.status).toBe(200);
    expect(header(robots, 'content-type')).toMatch(/^text\/plain/);
    expect((await get('/sitemap-index.xml')).status).toBe(200);
  });
});

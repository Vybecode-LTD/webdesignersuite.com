import type { APIRoute } from 'astro';

/** Production lets every crawler in, AI crawlers included; any other build keeps them all out. */
export const GET: APIRoute = ({ site }) => {
  const production = import.meta.env.PUBLIC_SITE_ENV === 'production';
  const body = production
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

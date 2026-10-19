/** The facts every page shares. One home, so a link or a name changes in one place. */
export const site = {
  name: 'Pro Web Design Suite',
  domain: 'webdesignersuite.com',
  description:
    'A Claude Code plugin for designing and building websites that stay coherent under many developers: tokens, measured contrast, and gates that fail the build on drift.',
  repo: 'https://github.com/Vybecode-LTD/webdesignersuite.com',
  pluginRepo: 'https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in',
  distributionRepo: 'https://github.com/Vybecode-LTD/pro-web-design-suite',
  /** The latest green run of this site's own gates, on main. */
  gatesRun:
    'https://github.com/Vybecode-LTD/webdesignersuite.com/actions/workflows/design-gates.yml?query=branch%3Amain+is%3Asuccess',
  company: { name: 'VybeCode', url: 'https://github.com/Vybecode-LTD' },
  install: '/plugin install pro-web-design-suite --marketplace Vybecode-LTD/pro-web-design-suite',
} as const;

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

/** The header's links. A page is listed once it exists: the smoke tests follow every one. */
export const nav: readonly NavLink[] = [
  { label: 'GitHub', href: site.pluginRepo, external: true },
];

/**
 * The public path of a built page. Pages are built as files (`install.html`) and served
 * without the extension, so `/index.html` is `/` and `/install.html` is `/install`.
 */
export function publicPath(pathname: string): string {
  const path = pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  return path === '' ? '/' : path;
}

/** The page's title as the tab and search results show it. */
export function pageTitle(title?: string): string {
  return title ? `${title} · ${site.name}` : `${site.name}: a Claude Code plugin with design gates`;
}

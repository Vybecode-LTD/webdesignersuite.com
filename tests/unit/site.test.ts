import { describe, expect, it } from 'vitest';
import { nav, pageTitle, publicPath, site } from '../../src/data/site';

describe('publicPath', () => {
  it.each([
    ['/index.html', '/'],
    ['/', '/'],
    ['/install.html', '/install'],
    ['/guides/index.html', '/guides/'],
    ['/guides/first-gate.html', '/guides/first-gate'],
    ['/install', '/install'],
  ])('%s is served at %s', (built, served) => {
    expect(publicPath(built)).toBe(served);
  });
});

describe('pageTitle', () => {
  it('names the product on the home page', () => {
    expect(pageTitle()).toContain(site.name);
  });

  it('puts the page first, then the product', () => {
    expect(pageTitle('Install')).toBe(`Install · ${site.name}`);
  });
});

describe('site facts', () => {
  it('installs from the distribution repository', () => {
    expect(site.install).toBe(
      '/plugin install pro-web-design-suite --marketplace Vybecode-LTD/pro-web-design-suite',
    );
  });

  it('links the footer claim to green runs of the gates workflow on main', () => {
    const url = new URL(site.gatesRun);
    expect(url.pathname).toBe('/Vybecode-LTD/webdesignersuite.com/actions/workflows/design-gates.yml');
    expect(url.searchParams.get('query')).toBe('branch:main is:success');
  });

  it('marks every off-site header link as external', () => {
    for (const link of nav) {
      expect(Boolean(link.external)).toBe(/^https?:/.test(link.href));
    }
  });
});

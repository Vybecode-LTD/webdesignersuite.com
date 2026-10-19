# webdesignersuite.com

The website of [Pro Web Design Suite](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in), a Claude Code plugin
for designing and building websites that stay coherent under many developers.

The site is built with the plugin and passes its own gates. Its tokens come from `/pro-web-design-suite:new-system "#e8440a"`,
and on every pull request CI runs the suite's gates on it: the design audit, accessibility (static and in a browser), performance
budgets and Core Web Vitals, and role-pair contrast.

## Stack

Astro 7, static output, to be served by Caddy on Railway (not deployed yet). Guides are MDX content collections. No
client-side JavaScript.

## Develop

Node 22.22 or newer, and Python 3.9 or newer for the gates.

```bash
npm ci
npm run dev        # http://localhost:4321
npm run build      # dist/
```

Testing, and every gate with the command that runs it: [docs/TESTING.md](docs/TESTING.md).

## Layout

```
src/styles/        the token system: index.css decides the cascade; tokens.css, base, layout, utilities
src/components/    Header, Footer
src/layouts/       Base.astro: the page shell, meta, canonical, robots
src/pages/         one file per page
src/content/       guides (MDX) and their schema
scripts/           the suite's gate scripts, vendored by /install-gate (don't edit)
tests/             unit/, dist/ (the built output), e2e/ (Playwright)
docs/decisions/    the decisions behind the site
```

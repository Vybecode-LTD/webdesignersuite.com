# What building this site found in the plugin

The site is the plugin's first real project built from `/new-system` and `/install-gate` on Astro. Each finding below was
measured here on 2026-10-19 against the plugin repo's `main` (`b932f6e`, version 3.6.0 in `plugin.json`). They belong in
the plugin repo (`C:\DEV\Pro-Web-Designer-Suite-Plug-in`), each with a regression test there. The site carries a local fix
or an annotated ignore for each, so it stays green meanwhile.

| # | Where | What happens | Severity | The site's workaround |
|---|---|---|---|---|
| F1 | starter `base.css`, `:where(pre)` | Nothing resets `pre > code`, so the UA's `code { font-family: monospace }` wins and every code block is set in Courier New, not `--font-mono`. | Bug, visible on every project with a code block | `:where(pre) > :where(code) { font: inherit; }` in `src/styles/base.css`; e2e test "code blocks are set in the mono token" (failed before: `monospace`) |
| F2 | `perf_audit.py`, rule `css-import` | It flags the starter's own `index.css` `@import`s when run as `perf_audit dist --src src`, which is the exact command `/install-gate`'s workflow runs. A bundler (Vite, here) inlines them; the built CSS has none. So a project fresh from `/new-system` plus `/install-gate` fails its first CI run with 7 errors. | Bug, blocks first CI | `perf-audit-ignore-file: css-import` in `index.css`, held honest by `tests/dist` (no built stylesheet keeps an `@import`) |
| F3 | `perf_audit.py`, rule `font-not-preloaded` | It matches preloads by the source file name, so a preload of the hashed build file (`geist-….BgDaEnEv.woff2`) still warns that the font "is never preloaded". | False positive (warning) | none needed |
| F4 | `perf_audit.py`, rule `missing-preconnect` | The page's own canonical and `og:url` (`https://webdesignersuite.com/…`) count as a third-party origin. | False positive (warning) | none needed |
| F5 | starter `tokens.css`, dark theme | `--bg-sunken` is `--neutral-1000`, the same as `--bg-canvas`, so a `pre` or a well on the dark canvas has no visible box. | Design gap | the hero's install box uses `--bg-surface` and a hairline |
| F6 | starter `layout.css`, `.page-grid` | A grid item holding a `pre` with a long line keeps its min-content width, so the page scrolls sideways at 320 px (721 px wide; `a11y_runtime` reflow error, WCAG 1.4.10), although `pre` scrolls. | Bug in a common layout | `u-min-0` on the hero's stack; e2e test "reflows to 320 px" (failed before: 721) |
| F7 | `/install-gate`'s workflow | `check_roles.py` is vendored but never run, so contrast drift in `tokens.css` doesn't fail CI. | Gap | `ci.yml` runs it |

F2 and F6 are the ones a new user hits first.

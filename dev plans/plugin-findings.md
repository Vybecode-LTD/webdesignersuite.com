# What building this site found in the plugin

The site is the plugin's first real project built from `/new-system` and `/install-gate` on Astro. Each finding below was
measured here on 2026-10-19 against the plugin repo's `main` (`b932f6e`, version 3.6.0 in `plugin.json`). Six are fixed
in the plugin repo and F5 in part (N50, P56, 2026-10-20), each with a regression test seen failing on `v3.6.0`. The fixes are on the
plugin's `main` for 4.0.0, **not yet released**. Until then, and until this site reruns `/install-gate` against it, the site
keeps its own workaround for each.

| # | Where | What happened | Fixed in the plugin | The site's workaround, to remove after 4.0.0 |
|---|---|---|---|---|
| F1 | starter `base.css`, `:where(pre)` | Nothing reset `pre > code`, so the UA's `code { font-family: monospace }` won and every code block was set in Courier New, not `--font-mono`. | [#186](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in/pull/186): `pre > code` inherits the block's font | `:where(pre) > :where(code) { font: inherit; }` in `src/styles/base.css` and the e2e test "code blocks are set in the mono token". The rule goes when `base.css` is refreshed from the starter; the test stays. |
| F2 | `perf_audit.py`, rule `css-import` | It flagged the starter's own `index.css` `@import`s under `perf_audit dist --src src`, the command `/install-gate`'s workflow runs. A bundler (Vite, here) inlines them. A fresh project failed its first CI run with 7 errors. | [#185](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in/pull/185): the rule reads shipped stylesheets only; a built file that keeps an `@import` still fails | `perf-audit-ignore-file: css-import` in `src/styles/index.css`. Remove it after upgrading the vendored `scripts/`. `tests/dist` (no built stylesheet keeps an `@import`) stays. |
| F3 | `perf_audit.py`, rule `font-not-preloaded` | It matched preloads by the source file name, so a preload of the hashed build file (`geist-….BgDaEnEv.woff2`) still warned that the font "is never preloaded". | [#185](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in/pull/185): a preload of the bundler's hashed file counts, and a weight's name is never read as a hash | none needed (a warning) |
| F4 | `perf_audit.py`, rule `missing-preconnect` | The page's own canonical link (`https://webdesignersuite.com/…`) counted as a third-party origin. (An earlier version of this file also named `og:url`; that is a `<meta>` the gate never reads.) | [#185](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in/pull/185): the canonical's host is first-party, and only a `<link>` that fetches something adds an origin | none needed (a warning) |
| F5 | starter `tokens.css`, dark theme | `--bg-sunken` is `--neutral-1000`, the same as `--bg-canvas`, so a `pre` or a well on the dark canvas had no visible box. | **In part**, [#186](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in/pull/186): a `pre` has a hairline `--border-subtle` edge. The token itself is unchanged, so anything else set on `--bg-sunken` still has no box on dark (see below). | the hero's install box uses `--bg-surface` and a hairline; keep it, it is a deliberate look |
| F6 | starter `layout.css`, `.page-grid` | A grid item holding a `pre` with a long line kept its min-content width, so the page scrolled sideways at 320 px (721 px wide; `a11y_runtime` reflow error, WCAG 1.4.10), although the `pre` scrolls. | [#186](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in/pull/186): `.page-grid > *` takes `min-inline-size: 0` | `u-min-0` on the hero's stack in `src/pages/index.astro`, and the e2e test "reflows to 320 px" (the test stays) |
| F7 | `/install-gate`'s workflow | `check_roles.py` was vendored and never run, so contrast drift in `tokens.css` didn't fail CI. | [#187](https://github.com/Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in/pull/187): the workflow runs it on the configured token files, after the command checks they resolve | the role-pair step in `ci.yml`. Remove it after rerunning `/install-gate`, which then writes the step into `design-gates.yml`. |

F2 and F6 are the ones a new user hits first.

## Still open in the plugin

- **F5, the rest:** on the dark theme `--bg-sunken` equals `--bg-canvas`, so anything that relies on it alone, not a `pre`, has no visible
  box. Fixing it means choosing a different dark `--bg-sunken`, which is a look the owner should pick, so it is not a bug fix.
  This site's own code sets nothing on `--bg-sunken` but `pre`.
- **N51:** `check_roles` resolves each scope's declarations by selector, not by source order (a dark block before a `:root`
  block gives the dark scope the colour the browser does not use). It is old and not from the fixes above; found in review
  of #187, scheduled as P57. This site keeps `:root` first, so it is not affected.

## When 4.0.0 ships

1. Rerun `/install-gate` (it upgrades `scripts/` and `design-gates.yml`; never edit those by hand).
2. Remove the workarounds in the right-hand column that say so, one commit each, with the gates green after each.
3. Refresh `src/styles/base.css` and `layout.css` from the starter, or keep the site's two small rules.

# Next session: webdesignersuite.com, phase 2 (the landing page and /install)

Written 2026-10-19 by the session that built phase 1, the foundation (it ran from `C:\DEV\Pro-Web-Designer-Suite-Plug-in`,
working in `C:\DEV\webdesignersuite.com`).

## 1. What this is and where it runs

- **webdesignersuite.com** is the website of **Pro Web Design Suite**, a Claude Code plugin: thirteen skills plus gates that
  fail a build when a website's design drifts. The plugin is developed in `C:\DEV\Pro-Web-Designer-Suite-Plug-in`
  (`Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in`) and installed from `Vybecode-LTD/pro-web-design-suite` (empty until 4.0.0).
- **This repo:** `C:\DEV\webdesignersuite.com`, https://github.com/Vybecode-LTD/webdesignersuite.com (public).
  Astro 7.3.8, static output, served by Caddy from a Dockerfile on Railway.
- **Staging:** https://site-staging-d036.up.railway.app (Railway project `webdesignersuite`, service `site`, environment
  `staging`, deploying from `main`). There is no production environment and no DNS yet.
- Read `CLAUDE.md`, `docs/HANDOFF.md` and `dev plans/site-plan.md` first.

## 2. Rules that override defaults

- **Decisions made, don't re-propose:** 0001 (static Astro plus a stock VybeSite blog later, guides as MDX, the plugin's brand
  `#e8440a`, landing and guides before the blog), 0002 (public repo; Claude merges once CI is green, threads are resolved and
  the PR is clean, with a merge commit; never auto-merge), 0003 (Railway staging now).
- **"This site passes its own gates" is in the footer.** Every PR keeps `ci.yml` and `design-gates.yml` green. Component code
  reads Tier-2 roles only: add a role to `tokens.css`, never read `--space-*` or a ramp step in a component.
- **Never edit `scripts/` or `.github/workflows/design-gates.yml`** by hand: they are the plugin's `/install-gate` output.
- **Railway settings live on the service,** not in the repo (Railway deprecated `railway.toml`). Read `docs/DEPLOY.md`.
- **Ask the owner first** before: creating the production environment or anything else that costs money, any DNS change,
  picking analytics, adding a licence, and anything that touches VybeSite, its Railway projects or a Buffer account.
- **Never fork VybeSite. Never serve downloads from a Railway bucket:** downloads come from GitHub Releases.
- Workspace rules (`C:\DEV\CLAUDE.md`, `knowledge/owner.md`): no OneDrive writes; commit by explicit path after reading the
  staged diff; questions go through AskUserQuestion with a real pro and con for each option; commands for the owner work in cmd.exe.
- The SEO directive applies (`C:\DEV\SEO_OPTIMIZATION.md`): read it before building the landing page.

## 3. The state, verified at the end of this session (2026-10-19)

- **`main`:** the merge of PR #3, on top of `041d514` (the merge of #2). Check with `git log --oneline -3`. The local checkout
  is on `main` and clean, apart from `node_modules/`, `dist/` and `.astro/`, which are ignored.
- **PRs:** #1 (the foundation), #2 (the image) and #3 (the handoff) are merged; none is open. Codex's one finding on #2 (the
  `www` test on staging) was fixed in #3 and its thread resolved.
- **CI:** `ci.yml` (jobs `site` and `image`) and `design-gates.yml` (`gates`, `windows`) were green on every PR.
- **Deployed and verified:** staging, commit `041d514`. Health check passed, `npm run test:http` 8 passed and 1 skipped (the
  `www` redirect, which can't pass through Railway's edge until the domain is attached), `a11y_runtime` 0 errors, and Core Web
  Vitals LCP 1.58 s, CLS 0, TBT 0 (throttled).
- **Half-done:** nothing.

## 4. The first job, then the order

1. **The landing page** (`/`), replacing the placeholder hero. Load the plugin's `landing-page-conversion` skill for the copy
   and the section order (`dev plans/site-plan.md`, "Phase 1 pages" lists the eleven sections). Persuasion stays honest: no
   invented numbers or testimonials. Run the plugin's `design-critique-gate` before showing it, and render it at desktop and
   phone width.
2. **`/install`**, with real release data read when the site builds: the latest release's version, date, zip, `SHA256SUMS` and
   `.skill` files from the distribution repo, falling back to the development repo until 4.0.0 is tagged.
3. Then phase 3: guides 1 to 4, `/changelog` (the plugin's CHANGELOG rendered at build), `/privacy`, and JSON-LD on every page.

Why this order: the landing page is the pitch and drives every later page's components. `/install` needs the release-data
loader that `/changelog` reuses.

## 5. Owner decisions still open (ask, don't decide)

- The site's licence: none yet. Ask whether the site's code is MIT like the plugin, or kept all-rights-reserved.
- Analytics: none, Plausible (no cookies, about $9 a month) or GA4 (free, needs a cookie notice).
- Which registrar holds `webdesignersuite.com`. That decides the DNS steps at launch.
- A contact form at launch (Formspree), or none until phase 2's blog.
- The production environment's spend, when launch comes.

## 6. Environment and tooling that worked

- From `C:\DEV\webdesignersuite.com`: `npm ci`, `npx playwright install chromium`, then `npm run check && npm test && npm run
  build && npm run test:dist && npm run test:e2e && npm run gates`. The runtime gates: `npx serve dist -l 8080`, then
  `node scripts/a11y_runtime.mjs --url http://127.0.0.1:8080/` and `node scripts/measure_vitals.mjs http://127.0.0.1:8080/
  --runs 7 --throttle lighthouse`. Against staging: `SITE_URL=https://site-staging-d036.up.railway.app npm run test:http`.
- `.design-suite.json` turns on the plugin's hooks here, so each edit to `src/` is audited as you go.
- Screenshots: the browser pane timed out while the page scrolled. A short Playwright script with `fullPage: true`, run from
  the repo so it resolves `playwright`, worked every time.
- **Traps hit:**
  - `dist/` in `.gitignore` also ignored `tests/dist/`. It is anchored now (`/dist/`).
  - Railway refused `railway.toml` ("Config as Code is deprecated"): set the service's settings with the connector instead.
  - The first `tests/http` run, about 30 s after the deploy settled, failed two checks that passed on every later run. Wait a minute.
  - There's no Docker on this machine. The image is tested in CI's `image` job.
  - `gh run view --log` is empty until the whole run finishes. `gh api .../jobs/ID/steps` gives each step's conclusion sooner.
  - Version picks: exact pins, at least about a week old (Astro 7.4.1 was hours old, so 7.3.8 was used).

## 7. Evidence and memory

- Decisions: `docs/decisions/` 0001 to 0003; **the next free number is 0004.**
- `docs/DEPLOY.md` (the Railway ids and the first deploy's results), `docs/TESTING.md` (each check and its regression
  tests), `docs/fonts.md` (the subset command and the fallback metrics).
- `dev plans/plugin-findings.md`: F1 to F7, with the site's workaround for each.

## 8. Candidates for `knowledge/` (with the owner's OK)

- **Railway config as code is refused for new services** ("deprecated"): set builder, health check and restart policy with
  the connector's `update-service`, and read them back. Home: the `railway-deploy-playbook` skill.
- **An HTTP test that sends a Host header can't pass through Railway's edge** for a domain not attached to the service. Skip
  it there, with the reason, and test it against the image. Home: `railway-deploy-playbook`.
- **Product sites:** downloads come from GitHub Releases, read when the site builds; never a Railway bucket (Kapture,
  StripKit, now this site). Home: a `knowledge/decisions/` entry.
- **Anchor build-output ignores** (`/dist/`): a bare `dist/` also ignores a `tests/dist/` folder. Home: `git-and-ci-traps`.

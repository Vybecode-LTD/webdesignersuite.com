---
document: CLAUDE
version: 0.1.0
last-updated: 2026-10-19
last-audit: 2026-10-19
managed-by: session-orchestrator/memory-updater
---

# CLAUDE.md: webdesignersuite.com

## Identity

- **Name:** webdesignersuite.com
- **Description:** The website of Pro Web Design Suite, the Claude Code plugin: landing page, install and downloads, guides, and later the blog.
- **Stack:** Astro (static output) served by Caddy from a Dockerfile on Railway. Phase 2 adds a stock VybeSite install
  (FastAPI, React, Postgres) for the blog and Buffer.
- **Repo:** https://github.com/Vybecode-LTD/webdesignersuite.com, public (decision 0002).
- **Type:** web-facing, so the SEO/GEO directive applies (`C:\DEV\SEO_OPTIMIZATION.md`). Web service, so it deploys to Railway.
  It is not a desktop download app: the plugin's releases come from `Vybecode-LTD/pro-web-design-suite`.

## Current State

- **Phase:** 1, the foundation, is done (2026-10-19): the repo (public, decision 0002), Astro 7, the tokens from
  `new_system.py "#e8440a"`, the layout, header and footer, CI (`ci.yml` plus the suite's `design-gates.yml`), the image
  (Dockerfile, Caddyfile), and Railway staging at https://site-staging-d036.up.railway.app (decision 0003, `docs/DEPLOY.md`).
- **Next:** phase 2, the landing page and `/install` (`docs/HANDOFF.md`).
- **Plugin findings:** building the site found 7 problems in the plugin (`dev plans/plugin-findings.md`); each has a local fix here.
- **Tests:** 21 unit, 10 dist, 8 e2e, 9 HTTP · **Open bugs:** 0 · **Doc version:** 0.3.0

The next agent's brief is `dev plans/NEXT_SESSION_PROMPT.md`.

## Commands

From the repo root (Git Bash or cmd; Node 22.22+, Python 3.9+). The detail is `docs/TESTING.md`.

```bash
npm ci && npx playwright install chromium
npm run dev                      # http://localhost:4321
npm run check && npm test        # astro check, Vitest unit
npm run build && npm run test:dist && npm run test:e2e
npm run gates                    # audit, a11y static, role pairs, perf static (after a build)
```

`scripts/` and `.github/workflows/design-gates.yml` are the plugin's `/install-gate` output: upgrade them by rerunning
`install_gate.py`, never by hand. The site's own checks are `.github/workflows/ci.yml`.

## Architecture (brief)

- **`site` (Railway):** Astro builds HTML; Caddy serves it with security headers and the www → apex redirect. The service's
  settings live on Railway, not in the repo (Railway deprecated `railway.toml`); the ids are in `docs/DEPLOY.md`.
- **Guides** are MDX in `src/content/guides/`, in series, schema-checked, and checked against the plugin's real commands and skills.
- **Release data** (version, zip, `SHA256SUMS`, `.skill` files) and the plugin's CHANGELOG are read from GitHub when the site
  builds, so crawlers see them. Downloads always come from GitHub Releases.
- **The design is the plugin's own:** tokens from `/pro-web-design-suite:new-system "#e8440a"`, and CI runs the suite's gates
  on the site. "This site passes its own gates" must stay true.
- **Phase 2:** the blog is a stock VybeSite install at `blog.webdesignersuite.com`, never a fork. The landing page shows its
  latest posts, fetched when the site builds.

## Critical gotchas

- **Never fork VybeSite** for the blog (decision 0001). Its theme renderer (Phase 3, PR 5) would conflict with any fork.
- **Never serve downloads from a Railway bucket:** a bucket can't be made public (Kapture.Tools' lesson).
- **VybeSite's CLAUDE.md asks before any Railway, DNS or Buffer change.** Phase 2 goes through the owner and VybeSite's sessions.
- **Never write into OneDrive,** including Documents and Desktop (`C:\DEV\CLAUDE.md`).
- **The hooks act here:** `.design-suite.json` turns on the plugin's design gate, a11y gate and generated-file guard, so each
  edit to `src/` is audited. Component code reads Tier-2 roles only; add a role to `tokens.css` rather than read `--space-*`.
- **Dark only:** `<html data-theme="dark">` is fixed in `Base.astro`; the light theme's tokens exist but nothing switches to them.
- **Pages are built as files** (`install.html`) and served without the extension; `publicPath()` gives the canonical path.
- **No inline `<style>` or `<script>`** (`inlineStylesheets: 'never'`), so the CSP needs no `unsafe-inline`; `tests/dist` holds it.

## Conventions

- **Git:** one branch per PR, conventional commits, commit by explicit path after reading the staged diff (the repo is public).
  **Claude merges** once CI is green, every review thread is resolved and the PR is clean, with a merge commit; never auto-merge (decision 0002).
- Plans and published-page sources go in `dev plans/`.

## Project map

| Topic | File | Read this when |
|---|---|---|
| The plan | `dev plans/site-plan.md` | before any work |
| Next agent's brief | `dev plans/NEXT_SESSION_PROMPT.md` | starting a session |
| Decisions | `docs/decisions/` | before re-deciding anything |
| Current state and next steps | `docs/HANDOFF.md` | starting a session |
| Deploy: Railway ids, settings, checks | `docs/DEPLOY.md` | before any deploy or Railway change |
| Tests and gates | `docs/TESTING.md` | before adding a test or changing CI |
| Plugin bugs found here | `dev plans/plugin-findings.md` | before working around a gate |
| The plugin | `C:\DEV\Pro-Web-Designer-Suite-Plug-in` | writing a guide or landing-page copy |
| The blog's platform | `C:\DEV\VybeSite` | phase 2 |
| The promotion plan | `C:\DEV\Pro-Web-Designer-Suite-Plug-in\dev plans\web-design-suite-distribution-and-promotion.md` | launch work |

## Project structure

```
webdesignersuite.com/
├── CLAUDE.md                 ← this file
├── src/                      ← styles/ (the token system), components/, layouts/, pages/, content/ (guides + schema), data/site.ts
├── scripts/                  ← the suite's gates, vendored by /install-gate
├── tests/                    ← unit/, dist/, e2e/
├── .github/workflows/        ← ci.yml (the site's checks), design-gates.yml (the suite's gates)
├── .design-suite.json        ← the project contract the gates and hooks read
├── docs/                     ← decisions/ (0001, 0002), TESTING.md, fonts.md
└── dev plans/                ← site-plan.md, plugin-findings.md, NEXT_SESSION_PROMPT.md, README.md
```

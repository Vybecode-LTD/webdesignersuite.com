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

- **Phase:** 0, planned. Nothing is built yet.
- **Last completed task:** the plan and the owner's four decisions (2026-10-19, `dev plans/site-plan.md`, `docs/decisions/0001`).
- **Active task:** phase 1, the foundation: repo, Astro, tokens, layout, CI with the suite's gates, Railway staging.
- **Coverage:** none yet · **Open bugs:** 0 · **Doc version:** 0.1.0

The next agent's brief is `dev plans/NEXT_SESSION_PROMPT.md`.

## Commands

To be filled in once the project exists (install, dev, build, test, gates).

## Architecture (brief)

- **`site` (Railway):** Astro builds HTML; Caddy serves it with security headers and the www → apex redirect.
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
| The plugin | `C:\DEV\Pro-Web-Designer-Suite-Plug-in` | writing a guide or landing-page copy |
| The blog's platform | `C:\DEV\VybeSite` | phase 2 |
| The promotion plan | `C:\DEV\Pro-Web-Designer-Suite-Plug-in\dev plans\web-design-suite-distribution-and-promotion.md` | launch work |

## Project structure

```
webdesignersuite.com/
├── CLAUDE.md                 ← this file
├── docs/decisions/           ← 0001: the site's architecture, guides, look and scope
└── dev plans/                ← site-plan.md, NEXT_SESSION_PROMPT.md, README.md
```

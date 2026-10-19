# 0001: The site's architecture, guides, look and launch scope

- **Date:** 2026-10-19
- **Decided by:** the owner, from four options each (AskUserQuestion), all four the recommended ones.

## Decisions

1. **Architecture:** a static Astro site on `webdesignersuite.com` for the landing page, install and guides, and a stock VybeSite
   install for the blog, its admin and Buffer at `blog.webdesignersuite.com`.
2. **Guides:** Markdown/MDX files in this repo, in series and prerendered.
3. **Look:** the plugin's own brand, orange `#e8440a` on near-black, built with the suite's tokens and passing its gates.
4. **Launch scope:** phase 1 is the landing page, install and the first guides. The blog and Buffer are phase 2.

## Options that lost, and why

- **Fork VybeSite**, as rhathcoat.com did: every upstream merge after VybeSite's theme renderer (Phase 3, PR 5) conflicts,
  and its client-rendered landing page shows crawlers that skip JavaScript an empty body (VybeSite's assessment, M3).
- **Copy only VybeSite's blog and Buffer modules into a new app:** the most work, and the copy stops getting VybeSite's fixes.
- **Wait for VybeSite's theme renderer:** no site until Phase 3 lands.
- **Guides as blog posts tagged "guide":** no series order or sidebar, client-rendered, and the tag filter matches substrings.
- **A new visual identity:** the README art and GitHub would no longer match. **Three mockups first:** an extra round first.
- **Everything at once:** the blog's install, first posts and Buffer would hold up the launch.

## What it requires

- The blog needs VybeSite's first real install to work. VybeSite's CLAUDE.md asks before Railway, DNS and Buffer changes.
- "This site passes its own gates" is a public claim, so the gates run in CI and must stay green.

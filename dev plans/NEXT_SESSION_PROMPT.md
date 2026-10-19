# Next session: webdesignersuite.com, phase 1 (the foundation)

Written 2026-10-19 by the session that planned the site (it ran in `C:\DEV\Pro-Web-Designer-Suite-Plug-in`).

## 1. What this is and where it runs

- **webdesignersuite.com** is the website of **Pro Web Design Suite**, a Claude Code plugin: thirteen skills plus gates that
  fail a build when a website's design drifts. The owner bought the domain.
- The plugin is developed in `C:\DEV\Pro-Web-Designer-Suite-Plug-in` (`Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in`, public, MIT). Users install it from the
  distribution repository `Vybecode-LTD/pro-web-design-suite` (public, empty until the plugin's 4.0.0 is tagged).
- The site will run on Railway: an Astro static build served by Caddy. **Read `dev plans/site-plan.md` first, all of it.**

## 2. Rules that override defaults

- **The owner's four decisions are made** (`docs/decisions/0001-site-architecture.md`): static Astro plus a stock VybeSite for
  the blog, guides as MDX in this repo, the plugin's own brand (`#e8440a`), and the landing page and guides before the blog. Don't re-propose them.
- **Never fork VybeSite.** Never serve downloads from a Railway bucket.
- **Ask the owner first** before: creating the GitHub repo (public or private is their call), creating the Railway project
  or anything that costs money, any DNS change, picking analytics, and anything that touches VybeSite, its Railway projects or a Buffer account.
- The workspace rules in `C:\DEV\CLAUDE.md` and `knowledge/owner.md` load automatically: no OneDrive writes; commit by explicit path
  after reading the staged diff; questions go through AskUserQuestion with a real pro and con for each option.
- The SEO directive applies (`C:\DEV\SEO_OPTIMIZATION.md`). Read it before building the first public page.

## 3. The state, verified at the end of the planning session (2026-10-19)

- **This folder** holds `CLAUDE.md`, `docs/decisions/0001-site-architecture.md`, `dev plans/site-plan.md`, this file and
  `dev plans/README.md`. **It is not a git repository yet, and there is no remote.** No code exists.
- **The plugin repo:** `main` is at `76d4b18`. The rename to `pro-web-design-suite` and the distribution pipeline (#180 to #182) are merged.
  The latest release is still 3.6.0 under its old name, `web-design-suite`; 4.0.0 isn't tagged yet.
- **GitHub:** `Vybecode-LTD/pro-web-design-suite` exists, public and empty. Its deploy key (write) pairs with the plugin repo's
  `DIST_DEPLOY_KEY` secret. Private vulnerability reporting is on in the plugin repo.
- **Nothing is deployed** for the site. There is no Railway project and no DNS record.
- **VybeSite** (`C:\DEV\VybeSite`): staging is live on Railway (`vybesite-staging`); there is no production install. Its local
  checkout was 17 commits behind `origin/main` (`432e1f3`) on 2026-10-19.

## 4. The first job, then the order

1. **Ask the owner** whether the repo is public or private. Then `git init`, create `Vybecode-LTD/webdesignersuite.com`, and push.
2. **Scaffold Astro** with static output, TypeScript strict, and MDX content collections for `guides`. Check Astro's current major
   and its APIs with the docs tool (context7) first.
3. **Make the tokens** with the plugin's `/pro-web-design-suite:new-system "#e8440a"` (from the installed plugin, or by running its
   `new_system.py` by path). Then the base layout, header, footer and type scale. Write `.design-suite.json` so the gates and hooks act here.
4. **CI:** build, Vitest, Playwright smoke tests, and the suite's gates on `src/` and on the built site. Use the plugin's
   `/install-gate`, which vendors the gate scripts and writes the workflow. Keep it green from the first PR.
5. **The Dockerfile** (Astro build, then Caddy with headers and a `/healthz`). **Ask before creating** the Railway project
   `webdesignersuite`, then deploy to a `staging` environment on its railway.app URL.
6. **Then phase 2 of the plan:** the landing page and `/install` with real release data. Load the plugin's
   landing-page-conversion skill for the copy and section order, and design-critique-gate before showing it.

Why this order: everything after needs the tokens, the layout and green gates. Building pages first would mean redoing them, and
"this site passes its own gates" has to hold from the start.

## 5. Owner decisions still open (ask, don't decide)

- Is the repo public or private?
- Analytics: none, Plausible or GA4?
- Which registrar holds `webdesignersuite.com`? That decides the DNS steps.
- A contact form at launch (Formspree), or none until phase 2?
- The Railway spend, before the project is created.

## 6. Environment and tooling

- Windows with Git Bash and PowerShell. The owner runs commands in cmd.exe, so any command you give them must work there.
- The plugin is installed in Claude Code (3.6.0 under its old name, `web-design-suite:*`, until 4.0.0 ships). Its scripts can run by
  path from `C:\DEV\Pro-Web-Designer-Suite-Plug-in\plugins\pro-web-design-suite\skills\<skill>\scripts\`, and need Python 3.9+.
- Node 20.19+, 22.13+ or 24+. Playwright's browsers for the runtime gates come from the plugin repo's `tooling/main`
  (`npm ci --prefix tooling/main`); this repo's CI needs its own.
- For Railway, load the `railway-deploy-playbook` skill first. Its traps: set `dockerfilePath`, or Railway uses Railpack; and don't
  reference `DATABASE_URL` before Postgres exists (phase 2).
- Earlier VybeCode product sites to learn from, not copy: `C:\DEV\StripKit-Website` (it fetches downloads from GitHub Releases,
  but its header is copied into 14 pages) and `C:\DEV\Kapture.Tools-Website` (it renders the changelog when it builds, and keeps app pages noindex).

## 7. Evidence and memory

- The plan and its sources: `dev plans/site-plan.md`. The research behind the promotion plan:
  `C:\DEV\Pro-Web-Designer-Suite-Plug-in\dev plans\web-design-suite-distribution-and-promotion.md`.
- The map of VybeSite's blog and Buffer integration (2026-10-19), in short:
  - **Buffer:** the GraphQL API at `api.buffer.com`, with a personal key pasted in the admin and stored encrypted. A person sends
    each share (queue, now, scheduled or draft), and every send is recorded first, so nothing posts twice.
  - **The blog:** Markdown posts written in a ProseMirror editor, with `/blog`, `/blog/:slug` and the sitemap.
  - **Its gaps:** no RSS upstream; JSON-LD is added in the browser; the body is client-rendered.
- The next free decision number is **0002**.

## 8. Candidates for `knowledge/` (with the owner's OK)

- **Product sites:** downloads come from GitHub Releases, read when the site builds; never a Railway bucket. Seen in Kapture and StripKit,
  and now this site. Proposed home: a `knowledge/decisions/` entry for VybeCode product sites.
- **A plugin's sensitive `userConfig` value** reaches only hooks and MCP servers, never a skill's script or the Bash tool. Proposed home: a
  Claude Code plugin skill, or `knowledge/`.

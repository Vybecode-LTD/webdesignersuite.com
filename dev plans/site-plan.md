# webdesignersuite.com: the site plan

2026-10-19. The home of **Pro Web Design Suite**, the Claude Code plugin (`Vybecode-LTD/Pro-Web-Designer-Suite-Plug-in`,
distributed from `Vybecode-LTD/pro-web-design-suite`). The owner bought the domain and chose the four calls below.

## The owner's decisions (2026-10-19)

| Question | Chosen | Lost, and why |
|---|---|---|
| How to reuse VybeSite | **A static site for the landing page, downloads and guides, plus a stock VybeSite install for the blog, its admin and Buffer**, at `blog.webdesignersuite.com` | *Fork VybeSite*: conflicts at every upstream merge after VybeSite's theme renderer (Phase 3, PR 5), and its client-rendered pages show crawlers an empty body. *Copy only the blog and Buffer code*: the most work, and it stops getting VybeSite's fixes. *Wait for the theme renderer*: no site until then. |
| Where guides live | **Markdown/MDX files in this repo**, in series, prerendered | *Blog posts tagged "guide"*: no order or sidebar, client-rendered, and VybeSite's tag filter matches substrings. |
| The look | **The plugin's own brand**: orange `#e8440a` on near-black (the README art), built with the suite's tokens and **passing its own gates** | *A new identity*: the README and GitHub would stop matching it. *Three mockups first*: an extra round before building. |
| Launch scope | **Phase 1: the landing page, install and downloads, and the first guides. Phase 2: the blog and Buffer** | *Everything at once*: the blog's install would hold up the launch. |

## Architecture

```
webdesignersuite.com ──► Railway service "site": Astro (static output), served by Caddy from a Dockerfile
   /             landing page
   /install      install commands, downloads, checksums
   /guides/...   guides in series (MDX in this repo)
   /changelog    the plugin's CHANGELOG, rendered when the site builds
   /privacy, 404, sitemap.xml, robots.txt, llms.txt

blog.webdesignersuite.com ──► phase 2: a stock VybeSite install (its own Railway project: web, worker, Postgres)
   blog, admin, Buffer sharing; the landing page shows its latest 3 posts, fetched when the site builds
```

- **Astro, static output** (these are technical calls). Pages ship as HTML, so crawlers and AI engines read every word,
  which fixes VybeSite's M3 for the pages that matter. JavaScript is off by default. Content collections check each guide's
  frontmatter against a schema. Plain HTML, as StripKit used, was rejected: StripKit's 14 pages each copy the header and footer.
  Next.js was rejected because nothing here needs a server runtime.
- **Caddy in a Dockerfile:** security headers (CSP, HSTS), long caching for hashed assets, and the redirect from www to the bare domain.
- **Downloads come from GitHub Releases**, never a Railway bucket, which can't be made public (Kapture's lesson). The build reads
  the distribution repository's latest release: the version, the date, the zip, `SHA256SUMS` and the `.skill` files. It
  reads the development repository's releases until 4.0.0 ships. The page leads with the one-line install:
  `/plugin install pro-web-design-suite --marketplace Vybecode-LTD/pro-web-design-suite`.
- **Rebuilds** happen on every push to `main`, once a day on a schedule, and later on each plugin release
  (`release.yml`'s `distribute` job dispatches one).

## The design, built with the suite (dogfooding)

- `/pro-web-design-suite:new-system "#e8440a"` makes the tokens. The styles follow the Nine Laws: one tokens file, cascade layers,
  a closed spacing scale, contrast measured by role.
- **CI runs the suite's own gates on the site:** `audit_design.py --strict`, `a11y_static.py`, `check_roles.py`, `perf_audit.py`
  with budgets, and `a11y_runtime.mjs` and `measure_vitals.mjs` on the built pages in Playwright.
- The footer says "This site passes its own gates" and links to the latest green run. That line is part of the pitch, so it
  has to stay true.

## Phase 1 pages

**`/`, the landing page.** The order follows landing-page-conversion. Persuasion stays honest: no fake numbers or testimonials.
1. **Hero:** the problem in one line ("Design systems are style guides nobody enforces"), the claim ("This one has a gate"),
   the install line with a copy button, and a short loop: Claude writes a hard-coded colour, the gate fails, Claude fixes it with a token.
2. **The problem:** drift when several developers touch one site.
3. **How it works:** the gate loop, the hooks and the MCP tools.
4. **The Nine Laws.**
5. **The thirteen skills**, as cards in the usual order of a project.
6. **What the gate catches:** real `audit_design.py` output on a sample.
7. **Proof:** the test count from CI, WCAG 2.2 AA measured, and this site's own gate run.
8. **Install, three ways:** the marketplace, the release zip, single `.skill` files.
9. **A teaser for the guides.**
10. **FAQ,** with `FAQPage` JSON-LD.
11. **Footer:** GitHub, the changelog, privacy, security, VybeCode.

**`/install`:** requirements (Claude Code, Python 3.9+, Node for the browser gates), the commands for each shell, the
latest release's downloads with SHA-256, the directory listing once it's live, updating, and uninstalling.

**`/guides/`:** a hub, then series with previous and next links and a sidebar. Each guide says which version it was checked against. The first eight:
1. Install and run your first gate
2. Start a new design system (`/new-system`, tokens, contrast)
3. Move an inherited codebase onto tokens (the census, the codemod, its review)
4. The gates in CI (`/install-gate`)
5. An accessibility audit (the static and runtime gates, and the manual pass)
6. Performance budgets and Core Web Vitals
7. Figma and Tokens Studio sync
8. A database schema to screens (Supabase; React, Vue or Svelte)

Later guides: email, documentation, versioning, the critique, client presentations, landing pages.

**`/changelog`** comes from the plugin's `CHANGELOG.md` when the site builds. **`/privacy`** is the site's own privacy page
(no tracking unless the owner picks analytics), and it links the plugin's "What it runs, sends and stores".

## SEO and AI search (the workspace's SEO directive applies)

- **Every page:** its own title and meta description, one H1, a canonical URL, and an OG image generated when the site builds.
- **JSON-LD:** `SoftwareApplication` and `Organization` on `/`, `TechArticle` with `HowTo` steps on each guide, `BreadcrumbList`,
  and `FAQPage`.
- **`sitemap.xml`, and `robots.txt` that lets AI crawlers in.** `llms.txt` lists the guides.
- Core Web Vitals are in the CI budget: LCP under 2.5 s and CLS under 0.1 on a throttled run.

## Tests

- **The content schema** (Vitest), with internal links checked when the site builds.
- **Guides against the plugin:** every `/pro-web-design-suite:*` command and every skill a guide names must exist in the
  plugin's latest release. The build reads its skill and command lists, so a guide can't drift from the plugin.
- **Playwright smoke tests** on each page type, plus the suite's gates above.
- Each fix gets a test that fails before the fix.

## Deploy

- **Railway:** project `webdesignersuite`, service `site` (Dockerfile, a health check on `/healthz`), environments `production`
  and `staging`.
- **Domain:** `webdesignersuite.com`, with `www.webdesignersuite.com` redirecting to it. These are the owner's steps: the DNS records at the
  registrar (which records depends on the registrar), and then Railway's certificate.
- **Phase 2's blog** is a separate Railway project from VybeSite's stock image, with `PARTS=blog,ai,social,contact`, at
  `blog.webdesignersuite.com`. Two prerequisites come first: VybeSite's own sessions have to agree, because its CLAUDE.md asks before Railway, DNS and Buffer changes,
  and its first real install has to work. The owner pastes the Buffer key in that install's admin (Settings → Company channels).

## Phases

1. **The site's foundation:** the repo, Astro, tokens from `/new-system`, the layout, CI with the suite's gates, and the Railway
   staging deploy.
2. **The landing page and `/install`,** with real release data and the hero loop.
3. **Guides 1 to 4, `/changelog` and `/privacy`.** SEO and JSON-LD go on every page.
4. **Launch:** guides 5 to 8, production on `webdesignersuite.com`. The plugin's `homepage` and `documentationUrl` then point
   here, and so does the README's link.
5. **The blog (phase 2):** the VybeSite install, Buffer, the first posts, and the landing page's teaser.

## Open owner decisions (asked when they're reached)

- Whether the site's repo is **public**, as a showcase built with the suite, or **private**.
- **Analytics:** none, Plausible (no cookies, about $9 a month) or GA4 (free, needs a cookie notice).
- **The registrar** holding `webdesignersuite.com`, which decides the DNS steps.
- **A contact form** at launch (Formspree, as StripKit and Kapture use) or none until the blog's contact module in phase 2.
- **Costs:** the site alone is a small service. The blog's install adds a web service, a worker and Postgres, estimated from VybeSite
  staging's usage before phase 2.

# Handoff: webdesignersuite.com

**Updated:** 2026-10-19, end of the session that built phase 1, the foundation.

## Where it stands

- **Repo:** https://github.com/Vybecode-LTD/webdesignersuite.com, public (decision 0002). Claude merges on green with a
  merge commit; auto-merge stays off.
- **Merged:**
  - **#1:** Astro 7.3.8, static output; the plugin's tokens (`new_system.py "#e8440a"`, 100/100 role pairs); self-hosted
    Geist and JetBrains Mono; the layout, header, footer, a placeholder home page and the 404; CI (`ci.yml` and the suite's
    `design-gates.yml`), green on the first run.
  - **#2:** the Dockerfile (Astro, then Caddy) and the Caddyfile: security headers, caching, redirects, `/healthz` and the
    404, all checked over HTTP by `tests/http` (CI's `image` job).
  - **#3:** this handoff, the next-session prompt, and the staging skip for the `www` test.
- **Railway (decision 0003):** project `webdesignersuite`, service `site`, environment `staging` only, deploying from `main`,
  at https://site-staging-d036.up.railway.app. The first deploy (`041d514`) passed its health check, `tests/http` (8 passed,
  1 skipped), `a11y_runtime` (0 errors) and Core Web Vitals (LCP 1.58 s, CLS 0). Ids and settings: `docs/DEPLOY.md`.
- **The plugin:** building the site found seven problems in it (`dev plans/plugin-findings.md`). The site works around each.

## Next

1. **Phase 2:** the landing page and `/install` with real release data (`dev plans/site-plan.md`). Load the plugin's
   landing-page-conversion skill for the copy and section order, and design-critique-gate before showing it.
2. **The plugin's F1 to F7,** in the plugin repo, each with a regression test there. F2 and F6 hit every new user first.

## Open owner decisions

- The site's licence (no `LICENSE`, and `package.json` names none).
- Analytics: none, Plausible or GA4.
- The registrar for `webdesignersuite.com` (the DNS steps at launch).
- A contact form at launch, or none until phase 2's blog.

## Warnings

- `scripts/` and `design-gates.yml` belong to the plugin's `/install-gate`. Rerun it to upgrade them; never edit them.
- Railway's service settings live on the service, not in the repo. Production will need the same ones (`docs/DEPLOY.md`).
- Staging deploys from `main`, so it is production's twin, not a gate.
- There's no Docker on the owner's machine. The image is tested in CI.
- Codex's review of #2's first commit was still running at merge. If it posts findings, fix them in a new PR.

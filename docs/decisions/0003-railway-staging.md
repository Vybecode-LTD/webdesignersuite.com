# 0003: Railway staging now

- **Date:** 2026-10-19
- **Decided by:** the owner (AskUserQuestion), the recommended option.

## Decision

Create the Railway project `webdesignersuite` in the color8 workspace (Pro plan), with the service `site` built from the
`Dockerfile` (Astro, then Caddy), and a `staging` environment that deploys from `main` on its railway.app URL. Staging is
`PUBLIC_SITE_ENV=staging`: `noindex` and a `Disallow: /` robots.txt. Production is a second environment at launch.

## The option that lost, and why

- **The Dockerfile only, no project until launch:** no spend until then, but Caddy's headers, the CSP and `/healthz` would not be
  proven on Railway until launch, so deploy surprises would land late.

## What it requires

- About $0.50 to $2 a month per environment, from the Pro plan's included usage (a static Caddy service idles at 30 to 60 MB).
- Staging deploys from `main`, so it is production's twin, not a gate: anything risky is tested in the PR (`ci.yml`'s `image` job).
- No DNS change until launch; the custom domain and its records are the owner's steps then.

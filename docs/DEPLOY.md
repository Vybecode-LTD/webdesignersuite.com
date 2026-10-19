# Deploy

The site is a static Astro build served by Caddy, in one image (`Dockerfile`), on Railway (decision 0003).

| | |
|---|---|
| Railway project | `webdesignersuite` (workspace color8's Projects, Pro plan), id `e35c0bd8-9f4a-4f2d-8283-00a3e1ebf77f` |
| Service | `site` (`f5e13be4-fab9-4842-8a69-a80d943d54ea`): builder `DOCKERFILE`, path `Dockerfile`, health check `/healthz` (60 s), restart on failure (5 retries) |
| Environments | `staging` (`f8f845f7-fd91-4ac4-b920-e33f322b45ed`), deploying from `main`, at https://site-staging-d036.up.railway.app (port 8080). `production` comes at launch. |
| Build variable | `PUBLIC_SITE_ENV`: `production` lets crawlers in; anything else (staging) is `noindex` with `Disallow: /` |
| Port | Railway injects `PORT` (8080); the Caddyfile listens on it |

## What the server does (`Caddyfile`)

- Security headers on every response, 404s included: a CSP with no `unsafe-inline`, HSTS, `nosniff`, a referrer policy,
  a permissions policy and COOP. The `Server` header is removed.
- `/_astro/*` (hashed) is cached for a year as immutable; everything else revalidates.
- `/install.html` redirects to `/install`, and `/index.html` to `/`. `/install` serves `install.html`.
- `www.webdesignersuite.com` redirects to the bare domain, keeping the path.
- An unknown address gets `404.html` with a 404 status.

`tests/http/server.test.ts` checks each of these over HTTP. CI runs it against the image (`ci.yml`, job `image`). Run it
against staging after a deploy:

```bash
SITE_URL=https://<staging>.up.railway.app npm run test:http
```

In cmd.exe: `set SITE_URL=https://<staging>.up.railway.app && npm run test:http`.

## Service settings

They live on the service, not in the repo: Railway refused `railway.toml` for this new service ("Config as Code is
deprecated", 2026-10-19), and its replacement, `.railway/railway.ts`, deletes whatever a whole-project file omits. They were
set with the Railway connector (`update-service`) and read back with `get-service-config`. Production needs the same settings.

## Checking a deploy

After a deploy, check the deploy log for the Dockerfile build and the `/healthz` health check, confirm the running
deployment is on the commit you expect, then run `tests/http` against the staging URL. Wait a minute after the deploy
settles: the first run on 2026-10-19, about 30 seconds in, failed two checks that passed on every run after.

On staging, the `www` test is skipped, not passed: Railway's edge only forwards a domain attached to the service, and the
railway.app certificate can't carry a `www.webdesignersuite.com` Host. It runs against the image in CI and on production.

The first staging deploy (2026-10-19, commit `041d514`): health check passed, `tests/http` 8 passed and 1 skipped,
`a11y_runtime` 0 errors, and Core Web Vitals on a throttled run were LCP 1.58 s, CLS 0 and TBT 0.

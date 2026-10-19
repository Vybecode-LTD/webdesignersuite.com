# Deploy

The site is a static Astro build served by Caddy, in one image (`Dockerfile`), on Railway (decision 0003).

| | |
|---|---|
| Railway project | `webdesignersuite` (workspace color8's Projects, Pro plan) |
| Service | `site`: Dockerfile builder, health check `/healthz`, restart on failure (`railway.toml`) |
| Environments | `staging`, deploying from `main`. `production` comes at launch. |
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

## Checking a deploy

A setting in `railway.toml` proves nothing until the deployment used it. After the first deploy, check the deploy log for
the Dockerfile build and the `/healthz` health check, and confirm the running deployment is on the commit you expect.

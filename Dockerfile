# webdesignersuite.com: Astro builds the static site, Caddy serves it.
# Railway builds this file (railway.toml sets the builder and the health check).

# --- build -------------------------------------------------------------------
# The OS codename is pinned: a floating tag that rolls to a new Debian breaks builds silently.
FROM node:24.22.0-bookworm-slim AS build
WORKDIR /app

# "production" lets crawlers in (robots.txt, no noindex). Anything else keeps them out.
# Railway passes a service variable of the same name as this build argument.
ARG PUBLIC_SITE_ENV=staging
ENV PUBLIC_SITE_ENV=${PUBLIC_SITE_ENV}

COPY package.json package-lock.json ./
# The build needs only `dependencies`: Astro and its integrations. The test tools stay out.
RUN npm ci --omit=dev --no-fund --no-audit

COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src
RUN npx astro build

# --- serve -------------------------------------------------------------------
FROM caddy:2.11.7-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
# Railway injects PORT (8080); the Caddyfile listens on it.
EXPOSE 8080

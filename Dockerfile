FROM node:lts-alpine AS builder
# Railway doesn't support secret mounts (https://docs.docker.com/reference/build-checks/secrets-used-in-arg-or-env/) unless we use RailPack, so that's why I left these warnings here.
ARG MAPKIT_ALLOWED_ORIGINS
ARG MAPKIT_JS_AUTH_KEY
ARG MAPKIT_JS_KEY_ID
ARG MAPKIT_JS_TEAM_ID
ARG VITE_API_URL
ARG VITE_POSTHOG_KEY

WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable

# Install deps first for better Docker layer caching (suggested by GPT, idk if railway actually does docker layer caching...)
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=s/6b6cf2bb-ab65-4142-8212-23204b8e75eb-/pnpm/store,target=/pnpm/store pnpm install --frozen-lockfile

# Build app
COPY . .
RUN pnpm build


FROM nginx:alpine

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=builder app/nginx/default.conf /tmp/nginx-default.conf
COPY --from=builder app/dist /usr/share/nginx/html/

ENTRYPOINT ["/docker-entrypoint.sh"]
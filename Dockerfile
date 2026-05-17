FROM node:lts-alpine AS builder

WORKDIR /app

# Enable pnpm via Corepack
RUN corepack enable

# Install deps first for better Docker layer caching (woah)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Build app
COPY . .
RUN pnpm build


FROM nginx:alpine

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=builder app/nginx/default.conf /tmp/nginx-default.conf
COPY --from=builder app/dist /usr/share/nginx/html/

ENTRYPOINT ["/docker-entrypoint.sh"]
# ─────────────────────────────────────────────
#  Furni-Store — Frontend (React + Vite)
#  Multi-stage build:
#    Stage 1 → build the static assets
#    Stage 2 → serve them via Nginx
# ─────────────────────────────────────────────

# ── Stage 1: Build ───────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────
FROM nginx:stable-alpine AS runner

# Remove default Nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the built assets from Stage 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx config that handles React SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

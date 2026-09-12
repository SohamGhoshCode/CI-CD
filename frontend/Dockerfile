# ─── Frontend Dockerfile (Multi-stage build) ───────────────────────────────────
#
# Stage 1: BUILD — install deps and build the React app with Vite
# Stage 2: SERVE — serve the built static files with Nginx (tiny, fast)
#
# Why multi-stage?
# The build stage uses a heavy Node image. The final image only keeps
# the compiled static files served by Nginx (~20MB vs ~300MB).

# ── Stage 1: Build ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including Vite dev deps)
COPY package*.json ./
RUN npm install

# Copy source code and build the production bundle
COPY . .
RUN npm run build
# Output: /app/dist/ contains the compiled HTML, CSS, JS

# ── Stage 2: Serve ─────────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default Nginx placeholder page
RUN rm -rf /usr/share/nginx/html/*

# Copy the built React app from Stage 1 into Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config to handle React Router (client-side routing)
# Without this, refreshing /cart would return 404 from Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

# Start Nginx in the foreground (required for Docker)
CMD ["nginx", "-g", "daemon off;"]

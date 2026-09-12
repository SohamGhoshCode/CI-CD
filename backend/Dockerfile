# ─── Backend Dockerfile ────────────────────────────────────────────────────────
# Stage 1: Build & run the Node.js / Express API
# Using Node 22 Alpine (same version as local, lightweight ~50MB)
FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files first (leverages Docker layer cache)
# If package.json doesn't change, npm install layer is reused
COPY package*.json ./

# Install only production dependencies (skip devDependencies like nodemon)
RUN npm install --omit=dev

# Copy the rest of the backend source code
COPY . .

# Expose the port the Express server listens on
EXPOSE 5001

# Start the server directly with node (not nodemon — nodemon is for dev only)
CMD ["node", "server.js"]

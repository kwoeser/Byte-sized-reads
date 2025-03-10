# Use a lightweight Node.js image
FROM node:18-alpine AS build

# Enable corepack (to use pnpm)
RUN corepack enable

# HACK: Since the frontend imports apiContract.ts from the backend, we need to
# install the backend dependencies and copy the apiContrcat file to the correct
# location relative to the frontend build. We also had to move the frontend
# Dockerfile to the root of the repository, since we can't copy files from
# outside of the build context.
WORKDIR /app/api
COPY frontend/package.json frontend/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile
COPY api/src/apiContract.ts ../api/src/apiContract.ts

# Set working directory
WORKDIR /app/frontend

# Copy package.json and pnpm-lock.yaml for better caching
COPY frontend/package.json frontend/pnpm-lock.yaml .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the frontend code
COPY frontend .

# Build the frontend using Vite
RUN pnpm build

# Serve the frontend using Caddy as a reverse proxy for static files and api
FROM caddy:2.9.1

# Write Caddyfile
COPY <<"EOT" /etc/caddy/Caddyfile
# Liste on port 5173
:5173 {
    # Reverse-proxy requests to /api to backend container
    handle_path /api/* {
        reverse_proxy backend:5174
    }

    # Serve static files
    handle {
        root * /srv
        try_files {path} /index.html
        file_server
    }
}
EOT

# Copy the built dist directory from the build stage
COPY --from=build /app/frontend/dist /srv

# Expose frontend port
EXPOSE 5173

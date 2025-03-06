# Use a lightweight Node.js image
FROM node:18-alpine

# Enable corepack (to use pnpm)
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json and lockfile first (to optimize caching)
COPY package.json pnpm-lock.yaml ./

# Force install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the backend source code
COPY . .

# Build TypeScript
RUN pnpm build

# Expose backend port
EXPOSE 5174

# Start the backend
CMD ["node", "dist/index.js"]

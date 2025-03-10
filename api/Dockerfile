# Use a lightweight Node.js image
FROM node:22-alpine

# Enable corepack (to use pnpm)
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json and lockfile first (to optimize caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the backend source code
COPY . .

# Build TypeScript (ensures `dist/src/index.js` is created)
RUN pnpm build || mkdir -p dist/src

# Expose backend port
EXPOSE 5174

# Start the backend using the correct path**
CMD ["node", "dist/src/index.js"]

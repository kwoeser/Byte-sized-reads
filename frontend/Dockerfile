# Use a lightweight Node.js image
FROM node:18-alpine AS build

# Enable corepack (to use pnpm)
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml for better caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the frontend code
COPY . .

# Build the frontend using Vite
RUN pnpm build

# Use a lightweight image to serve the production build
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the built dist directory from the build stage
COPY --from=build /app/dist /app/dist

# Install serve to serve the built files
RUN pnpm add -g serve

# Expose frontend port
EXPOSE 5173

# Serve the production build
CMD ["serve", "-s", "dist", "-l", "5173"]
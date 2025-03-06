# Use a lightweight Node.js image
FROM node:18-alpine

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

# Expose frontend port
EXPOSE 5173

# Start the frontend
CMD ["pnpm", "dev"]

# Multi-stage build for the entire workspace
FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY . .
EXPOSE 3001
CMD ["pnpm", "dev"]

# Build stage
FROM base AS build
COPY . .
RUN pnpm build

# Production stage
FROM node:22-alpine AS production
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages/*/package.json ./packages/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built applications
COPY --from=build /app/packages/*/dist ./packages/

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S apiline -u 1001
USER apiline

EXPOSE 3001

CMD ["pnpm", "start:prod"]

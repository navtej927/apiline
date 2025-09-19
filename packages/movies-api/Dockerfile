# Multi-stage build for news-api
FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

# Copy news-api package files
COPY packages/news-api/package.json ./packages/news-api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Development stage
FROM base AS development
COPY packages/news-api ./packages/news-api
WORKDIR /app/packages/news-api
EXPOSE 3001
CMD ["pnpm", "start:dev"]

# Build stage
FROM base AS build
COPY packages/news-api ./packages/news-api
WORKDIR /app/packages/news-api
RUN pnpm build

# Production stage
FROM node:22-alpine AS production
RUN npm install -g pnpm

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages/news-api/package.json ./packages/news-api/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application
COPY --from=build /app/packages/news-api/dist ./packages/news-api/dist

WORKDIR /app/packages/news-api

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3001

CMD ["node", "dist/main.js"]

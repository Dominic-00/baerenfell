# Multi-stage build for smaller image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Production stage
FROM base AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy only necessary files
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/server ./server
COPY --from=builder --chown=nodejs:nodejs /app/client ./client
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

# Create uploads and products directories
RUN mkdir -p uploads/products uploads/artists client/products && \
    chown -R nodejs:nodejs uploads client/products

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "server/server.js"]

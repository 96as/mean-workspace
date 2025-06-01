FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy essential configuration files
COPY tsconfig.base.json ./
COPY nx.json ./
COPY jest.preset.js ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code (excluding files handled by .dockerignore)
COPY api/ ./api/
COPY eslint.base.config.mjs ./
COPY eslint.config.mjs ./
COPY jest.config.ts ./

# Build the API
RUN npx nx build api --prod

# Remove dev dependencies and clean cache
RUN npm prune --production && npm cache clean --force

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/api/main.js"]
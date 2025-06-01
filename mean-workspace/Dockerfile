FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy TypeScript configuration files
COPY tsconfig.base.json ./
COPY nx.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the API
RUN npx nx build api --prod

# Remove dev dependencies
RUN npm ci --only=production && npm cache clean --force

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/api/main.js"]
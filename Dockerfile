# THE EMPIRE AFFILIATE MARKETING HUB - 24/7 Docker Configuration
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the React frontend
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Create non-root user for security
RUN addgroup -g 1001 -S empire && \
    adduser -S empire -u 1001

# Change ownership of the app directory
RUN chown -R empire:empire /app

# Switch to non-root user
USER empire

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["node", "server/index.cjs"]
# Production Dockerfile for API
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ONLY production dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port (Azure App Service expects 3000 by default or via WEBSITES_PORT)
EXPOSE 3000

# Start command
CMD ["npm", "start"]

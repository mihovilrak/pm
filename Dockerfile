# Build frontend
FROM node:23-alpine3.19 AS frontend-builder

# Set working directory
WORKDIR /app/fe

# Copy package and lock files
COPY fe/package*.json fe/yarn.lock ./

# Install dependencies
RUN mkdir node_modules && \
    yarn config set cache-folder /tmp/yarn-cache && \
    yarn install --frozen-lockfile --prefer-offline \
    --production=true --link-duplicates --ignore-optional && \
    yarn add -D @babel/plugin-proposal-private-property-in-object && \
    yarn cache clean --all

# Copy source code
COPY fe/src/ ./src/
COPY fe/public/ ./public/

# Set environment variables
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV BABEL_ENV=production

# Build the frontend
RUN yarn run build --verbose

# Build backend
FROM node:23-alpine3.19 AS backend-builder

# Set working directory
WORKDIR /app/api

# Copy package and lock files
COPY api/package*.json api/yarn.lock ./

# Install dependencies
RUN mkdir node_modules && \
    yarn config set cache-folder /tmp/yarn-cache && \
    yarn install --frozen-lockfile --prefer-offline \
    --production=true --link-duplicates --ignore-optional && \
    npm install -g @vercel/ncc && \
    yarn cache clean --all

# Copy source code
COPY api/src/ ./src/

# Build the API
RUN ncc build src/app.js -o dist --no-cache -q

# Build notification service
FROM node:23-alpine3.19 AS notification-builder

# Set working directory
WORKDIR /app/service

# Copy package and lock files
COPY notification-service/package*.json notification-service/yarn.lock ./

# Install dependencies
RUN mkdir node_modules && \
    yarn config set cache-folder /tmp/yarn-cache && \
    yarn install --frozen-lockfile --prefer-offline \
    --production=true --link-duplicates --ignore-optional && \
    npm install -g @vercel/ncc && \
    yarn cache clean --all

# Copy source code
COPY notification-service/src/ ./src/

# Build the service
RUN ncc build src/index.js -o dist --no-cache -q

# Final image
FROM nginx:1.25.3-alpine

# Copy built applications
WORKDIR /app

# Copy and set up startup script
COPY start-app.sh /start-app.sh
COPY db/backup.sh /usr/local/bin/backup.sh
COPY db/pg_dump_cron /dp_dump_cron

# Install dependencies and set up startup script
RUN apk add --no-cache \
    dcron \
    nodejs \
    npm \
    postgresql-client && \
    chmod +x /start-app.sh && \
    mkdir -p api service db-init && \
    chmod +x /usr/local/bin/backup.sh && \
    chmod 0644 /dp_dump_cron && \
    mv /dp_dump_cron /etc/cron.d/pg_dump_cron && \
    crontab /etc/cron.d/pg_dump_cron

# Copy database init scripts
COPY db/init/ ./db-init/

# Copy built applications
COPY --from=frontend-builder /app/fe/build /usr/share/nginx/html
COPY --from=backend-builder /app/api/dist/* ./api/
COPY --from=notification-builder /app/service/dist/* ./service/

# Copy NGINX configuration
COPY fe/nginx.conf /etc/nginx/nginx.conf

# Copy email templates
COPY notification-service/src/templates/ ./service/templates/

# Expose ports
EXPOSE 80 5000

# Start the application
CMD ["/start-app.sh"]
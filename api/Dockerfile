# Import the official node alpine image as the builder stage
FROM node:23-alpine3.19 AS builder

# Set working directory
WORKDIR /usr/src

# Copy package.json and install dependencies
COPY package*.json ./
COPY ./src/ ./
RUN apk update && \
    apk add --no-cache yarn && \
    mkdir node_modules && \
    yarn install --production=true --link-duplicates --ignore-optional && \
    npm install -g @vercel/ncc && \
    ncc build app.js -o dist --no-cache -q

# Import the official node alpine image as the runtime stage
FROM node:23-alpine3.19

# Set working directory
WORKDIR /usr/src

# Copy built app from builder stage
COPY --from=builder /usr/src/dist/index.js .

# Expose port 5000 for the API
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]

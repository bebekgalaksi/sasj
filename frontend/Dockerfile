# Stage 1: Build the Vite React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package definitions for caching layer
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Serve production bundle with Nginx
FROM nginx:alpine

# Copy built distribution files to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web server port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

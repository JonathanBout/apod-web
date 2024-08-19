# Use the node image from official Docker Hub
FROM node:lts-bookworm-slim AS build-stage
# set the working directory
WORKDIR /app
# Copy the working directory in the container
COPY package*.json ./

# Install the project dependencies
RUN npm ci && npm cache clean --force

# Copy the rest of the project files to the container
COPY . .

# Build the Vue.js application to the production mode to dist folder
RUN npm run build

# Use the lightweight Nginx image from the previous stage for the nginx container
FROM flashspys/nginx-static AS production-stage
WORKDIR /app
# Copy the build application from the previous stage to the Nginx container
COPY --from=build-stage /app/dist ./

# remove the default Nginx configuration file and copy our own
RUN rm -rf /etc/nginx/conf.d/default.conf 
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose the port 80
EXPOSE 80
# Start Nginx to serve the application
CMD ["nginx", "-g", "daemon off;"]
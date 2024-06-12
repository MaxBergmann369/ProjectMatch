# Start your image with a node base image
FROM node:latest as build
LABEL authors="A.Höllerl,M.Bergmann,A.Jasic"

COPY . /app

WORKDIR /app

# Install node packages and build the app
RUN npm install
RUN npm run build

# Setup Nginx to act as a reverse proxy
FROM nginx:latest

# Copy the Nginx configuration file. This file should include configuration
# for proxying requests to the Express server running on port 3000.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built app and the start script
COPY --from=build /app /app
COPY start.sh /start.sh

# Make the start script executable
RUN chmod +x /start.sh

EXPOSE 80

# Use the custom start script as the entry point
ENTRYPOINT ["/start.sh"]
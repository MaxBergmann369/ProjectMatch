# Start your image with a node base image
FROM node:latest as build
LABEL authors="A.Höllerl,M.Bergmann,A.Jasic"

COPY . /app

WORKDIR /app

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm install

EXPOSE 3000

# Start the app using serve command
CMD [ "npm", "start" ]

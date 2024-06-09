# Start your image with a node base image
FROM node:latest as build
LABEL authors="A.Höllerl,M.Bergmann,A.Jasic"

COPY . /app

WORKDIR /app/src

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm install

RUN npm run build

EXPOSE 5000

# Start the app using serve command
CMD [ "npm", "start" ]

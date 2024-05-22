# Start your image with a node base image
FROM node:latest

COPY . /app

WORKDIR /app

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm install

RUN npm run build

EXPOSE 3000

# Start the app using serve command
CMD [ "npm", "start" ]
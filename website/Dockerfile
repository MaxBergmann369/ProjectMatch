FROM node:latest as build
LABEL authors="A.Resch,E.Lambourne,B.Tsolmonbat"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest as production

COPY --from=build /app /usr/share/nginx/html

RUN apt-get update && \
    apt-get install dos2unix && \
    apt-get clean

COPY nginx.conf /etc/nginx/conf.d/projectmatch.conf
RUN dos2unix /etc/nginx/conf.d/projectmatch.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

FROM node:7.2.0

COPY . /srv

WORKDIR /srv/node-api
RUN npm install

EXPOSE 8080

CMD node server.js
FROM node:7.2.0

COPY . /srv

WORKDIR /srv
RUN npm install

ENV FB_SERVICEJSONPATH ./firebase.json
ENV ES_HOST elasticsearch

ENV ES_PORT 9200

ENTRYPOINT ["node", "app.js"]

FROM node

WORKDIR /usr/app

COPY server/package.json .

RUN npm install

COPY server/. .
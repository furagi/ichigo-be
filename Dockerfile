FROM node:14-alpine as base
WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./
COPY src ./src

RUN npm install

FROM base as test
RUN apk update
RUN apk add --no-cache sqlite
COPY nest-cli.json ./
COPY test ./test
RUN npm run test:e2e && npm run test

FROM base as production
COPY tsconfig.build.json ./
CMD npm run build && npm run start:prod
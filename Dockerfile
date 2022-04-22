FROM node:14-alpine
WORKDIR /usr/src/app

COPY package*.json tslint.json tsconfig.json ./

RUN npm install

COPY . .
EXPOSE 4040
CMD npm start
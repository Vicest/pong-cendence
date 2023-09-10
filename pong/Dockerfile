FROM node:lts-alpine

WORKDIR /pong
#COPY ./tools/package*.json ./ TODO REBUILD PACKAGE-LOCK
COPY package.json ./

RUN npm install
RUN npm -g update

COPY . /pong

RUN npm run build
ENTRYPOINT [ "npm", "run", "start:debug" ]

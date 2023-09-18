FROM node:lts-alpine

WORKDIR /backend
#COPY ./tools/package*.json ./ TODO REBUILD PACKAGE-LOCK
COPY package.json ./

RUN npm install
RUN npm -g update
RUN npm install @nestjs/typeorm typeorm pg
RUN npm install -g typescript

COPY . /backend

RUN npm run build
ENTRYPOINT [ "npm", "run", "start:debug" ]

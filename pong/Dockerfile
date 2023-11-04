FROM node:alpine

WORKDIR /usr/src/backend

COPY package.json tsconfig.json .prettierrc ./

RUN npm update
RUN npm install

ENTRYPOINT [ "npm", "run", "start:dev" ]

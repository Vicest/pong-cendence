FROM node:alpine

WORKDIR /usr/src/backend

#RUN npm install --global yarn
COPY backend/package.json backend/tsconfig.json backend/.prettierrc ./

RUN apk update && apk add --no-cache curl
RUN yarn install

COPY  .env ../
ENTRYPOINT [ "yarn", "start:dev" ]

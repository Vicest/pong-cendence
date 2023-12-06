FROM node:alpine

EXPOSE ${BACKEND_PORT} ${BACKEND_WEBSOCKETS_PORT}

WORKDIR /app
ENTRYPOINT yarn install && yarn run start:dev

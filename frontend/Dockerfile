FROM node:18.4.0 as build

EXPOSE ${FRONTEND_PORT}

ENV PUBLIC_BACKEND_PORT=${BACKEND_PORT}
ENV PUBLIC_BACKEND_BASE=${BACKEND_BASE}

RUN apt-get update && apt-get install -y xdg-utils

WORKDIR /usr/src/frontend
ENTRYPOINT yarn install && yarn run dev --host ${HOST} --open

FROM node:18.4.0

EXPOSE ${FRONTEND_PORT}

ENV PUBLIC_BACKEND_PORT=${BACKEND_PORT}
ENV PUBLIC_BACKEND_BASE=${BACKEND_BASE}

WORKDIR /usr/src/frontend
ENTRYPOINT yarn install && yarn run build && yarn run preview --host ${HOST} --port ${FRONTEND_PORT}

FROM node:18.4.0

EXPOSE ${FRONTEND_PORT}

ENV PUBLIC_BACKEND_PORT=${BACKEND_PORT}
ENV PUBLIC_BACKEND_BASE=${BACKEND_BASE}

ENTRYPOINT yarn install && yarn run build && yarn run dev --host ${HOST} --port ${FRONTEND_PORT}

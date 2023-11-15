FROM node:alpine

WORKDIR /usr/src/backend

COPY .env backend/package.json backend/tsconfig.json backend/.prettierrc ./

RUN npm update
RUN npm install

ENTRYPOINT [ "npm", "run", "start" ]

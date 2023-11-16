FROM node:alpine

WORKDIR /usr/src/backend

#RUN npm install --global yarn
COPY .env backend/package.json backend/tsconfig.json backend/.prettierrc ./

RUN yarn install

ENTRYPOINT [ "yarn", "start" ]

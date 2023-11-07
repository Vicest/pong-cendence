FROM node:alpine

WORKDIR /usr/src/backend

COPY package.json tsconfig.json .prettierrc ./

RUN npm update
RUN npm install
#RUN npm install @nestjs/typeorm typeorm pg
#RUN npm install -g typescript

#RUN npm run build
ENTRYPOINT [ "npm", "run", "start:debug" ]

FROM node:19


RUN mkdir -p /usr/src/node-app/

COPY package.json ./
COPY package-lock.json ./
RUN npm i --ignore-scripts
COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
FROM node:16.15.1

RUN mkdir -p /usr/src/react-app
COPY . /usr/src/react-app/
WORKDIR /usr/src/react-app
COPY package*.json ./

RUN npm install -g npm@8.19.2
RUN npm install


RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

CMD [ "npm", "start" ]
#CMD [ "sleep", "infinity" ]
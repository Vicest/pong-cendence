FROM node:16.15.1


RUN mkdir -p /usr/src/node-app/
COPY . /usr/src/node-app/
WORKDIR /usr/src/node-app

RUN npm install -g npm@8.19.2
RUN npm install --ignore-scripts

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
#CMD [ "sleep", "infinity" ]
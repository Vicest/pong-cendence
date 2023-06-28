FROM node:lts-alpine AS webfront-application

#TODO You know, the whole she-bang, copy&install the app using npm.
#WORKDIR /front
#TODO Copy just the info to install
#COPY package*.json ./
#TODO Install
#RUN npm install

FROM nginx:stable-alpine AS front-server

#TODO Do the configure stuff for nginx

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]

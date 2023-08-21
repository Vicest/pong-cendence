FROM node:18.4.0 as build

RUN mkdir app
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install


RUN npm run build

FROM node:19-alpine3.16

WORKDIR .
COPY --from=build ./app .


ENV HOST=0.0.0.0
EXPOSE 4200
CMD ["npm","run", "preview","--", "--host", "0.0.0.0", "--port", "4200"]
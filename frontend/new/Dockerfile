FROM node:18.4.0 as build
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:18.4.0-alpine3.16
WORKDIR /app
COPY --from=build /app .
ENV HOST=0.0.0.0
EXPOSE 5173
# CMD ["npm", "run", "dev"]
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]

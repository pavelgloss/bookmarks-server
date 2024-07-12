FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json  ./

COPY . .

RUN npm install
RUN npm run build

EXPOSE 3000/tcp

CMD [ "node", "dist/main.js" ]
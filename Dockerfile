FROM node:20

WORKDIR /testapp

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 5050

CMD ["node", "/testapp/server.js"]


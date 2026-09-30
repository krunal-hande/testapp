FROM node


ENV	MONGO_DB_USERNAME=admin \
	MONGO_DB_PASSWORD=qwerty 


RUN mkdir -p testapp

WORKDIR /testapp

COPY package*.json ./
RUN npm install --omit=dev

COPY . /testapp
EXPOSE 5050

#RUN docker compose -f mongo.yaml -d
CMD ["node", "/testapp/server.js"]
	


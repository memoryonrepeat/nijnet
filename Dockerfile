FROM node:15.3.0-alpine3.10

WORKDIR /srv/nijnet

COPY package*.json ./

RUN npm install

COPY . /srv/nijnet

EXPOSE 8081

RUN npm test

CMD ["npm", "start", "linkin park"]

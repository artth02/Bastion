FROM node:12

EXPOSE 10007 10008

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

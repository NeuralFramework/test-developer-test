FROM node:24.11.0-alpine3.22
WORKDIR /home/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
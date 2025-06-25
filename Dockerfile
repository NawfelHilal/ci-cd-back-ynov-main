#Create Nodejs Image for JSP Tutorial Application
FROM node:20
WORKDIR /server

ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install jest -g --silent

EXPOSE 8000
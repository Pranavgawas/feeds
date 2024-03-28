# project frontend
FROM node:alpine3.16
WORKDIR /myapp
COPY ./package.json /myapp/
RUN npm install
RUN npm i react-router-dom
RUN npm install react-bootstrap bootstrap
COPY . /myapp/
RUN npm run build
CMD [ "npm", "start" ]
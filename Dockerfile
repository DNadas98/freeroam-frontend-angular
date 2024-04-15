FROM node:21-alpine

# See the .dockerignore for details

COPY ./src /home/app/src
COPY ./angular.json /home/app/angular.json
COPY ./package.json /home/app/package.json
COPY ./tsconfig.json /home/app/tsconfig.json
COPY ./tsconfig.app.json /home/app/tsconfig.app.json
COPY ./tsconfig.spec.json /home/app/tsconfig.spec.json
COPY ./tailwind.config.js /home/app/tailwind.config.js

WORKDIR /home/app
RUN npm install
RUN npm run build

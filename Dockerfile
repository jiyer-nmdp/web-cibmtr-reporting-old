#base image
FROM node:11-alpine AS builder

# set working directory
WORKDIR /usr/src/app

EXPOSE 4200

# install and cache app dependencies
COPY package.json /usr/src/app/

# Multiple registries - NMDP scope Login Widget and Angular Libraries
COPY .npmrc /usr/src/app/

RUN npm install -g @angular/cli

RUN npm install

# add app
COPY . /usr/src/app

# start app
CMD ng serve --host 0.0.0.0 --disable-host-check

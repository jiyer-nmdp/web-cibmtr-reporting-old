# DockerFile Contains MultiStage of Image (to run the App in Prod Mode in NgInx Server)

# Stage 1

#base image
FROM node:12.7-alpine AS builder
#FROM dockerhub.nmdp.org:8443/nmdp/nmdp-node:12-stretch-slim.nmdp.latest AS builder

USER root

# set working directory
WORKDIR /usr/src/app

# copy package & package-lock.json files
COPY package*.json ./

# expose port
EXPOSE 80

# Multiple registries - NMDP scope Login Widget and Angulang buir Libraries
COPY .npmrc /usr/src/app/

# Install Angular Cli globally
RUN npm install -g @angular/cli@11.2.11

# Install Node Modules
RUN npm install

#Copying rest of project into image
COPY . .

ARG build_environment

# build the artifacts
RUN npm run build:$build_environment

# Stage 2
FROM dockerhub.nmdp.org:8443/nginx:latest

# Copy our default nginx conf
COPY nginx/default.conf /etc/nginx/conf.d/

# remove default website
RUN rm -rf /usr/share/nginx/html/*

# From 'builder copy the dist artifacts into the nginx folder'
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx/html/

RUN chmod -R 777 /usr/share/nginx/html/

# expose port
EXPOSE 80

# start the nginx service with env-variable dynamic injection
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/CibmtrEHRApp/assets/env.template.js > /usr/share/nginx/html/CibmtrEHRApp/assets/env.js && nginx -g 'daemon off;'"]

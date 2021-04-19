# DockerFile Contains MultiStage of Image (to run the App in Prod Mode in NgInx Server)

# Stage 1

#base image
FROM dockerhub.nmdp.org:8443/nmdp/nmdp-node:12-alpine3.11.nmdp.latest AS builder
#FROM dtr.nmdp.org:4444/nmdp/nmdp-node:12-stretch-slim.nmdp.latest AS builder

# set working directory
WORKDIR /usr/src/app

# copy package & package-lock.json files
COPY package*.json ./

# expose port
#EXPOSE 4200

# Multiple registries - NMDP scope Login Widget and Angulang buir Libraries
COPY .npmrc /usr/src/app/

# Install Angular Cli globally
RUN npm install -g @angular/cli@7.3.4

# Install Node Modules
RUN npm install

#Copying rest of project into image
COPY . .

ARG ENVIRONMENT=prod

# build the artifacts
RUN npm run build:$ENVIRONMENT

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

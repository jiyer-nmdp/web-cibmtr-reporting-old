# DockerFile Contains MultiStage of Image (to run the App in Prod Mode in NgInx Server)

# Stage 1

#base image
FROM node:11-alpine AS builder

# set working directory
WORKDIR /usr/src/app

# copy package & package-lock.json files
COPY package*.json ./

# expose port
EXPOSE 80

# Multiple registries - NMDP scope Login Widget and Angulang buir Libraries
COPY .npmrc /usr/src/app/

# Install Angular Cli globally 
RUN npm install -g @angular/cli@7.3.4

# Install Node Modules
RUN npm install

#Copying rest of project into image
COPY . .

# build the artifacts
RUN npm run build:prod


# Stage 2
FROM nginx:1.13.3-alpine

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

# start the nginx service
CMD ["nginx", "-g", "daemon off;"]

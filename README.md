# CibmtrEHRApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

The App Currently retriving EHR Patient and Observations and  Save/update in CIBMTR FHIR Server with CRID.


## Build and Run on Docker

To build this application as a docker image, first ensure Docker is installed on your machine (https://www.docker.com/). The image can be built by executing:
'sh dockerize.sh', this will install the application as a docker image named: 'web-cibmtr-reporting'.

To Run the previously built docker image, simply execute

'docker run -d -p 4200:4200 --name web-cibmtr-reporting web-cibmtr-reporting'

This will execute the application through the Node server that is installed on the image. Your application will be accessible at: 0.0.0.0:4200.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

# Docker Build Steps

docker build -t web-cibmtr-reporting .
docker tag web-cibmtr-reporting:latest  dockerhub.nmdp.org:8443/nmdp/web-cibmtr-reporting-{env}:mmddyyyy
docker push dockerhub.nmdp.org:8443/nmdp/web-cibmtr-reporting-{env}:mmddyyyy




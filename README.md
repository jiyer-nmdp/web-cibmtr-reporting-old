# CibmtrEHRApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.6.

The App Currently retriving EHR Patient and Observations and  Save/update in CIBMTR FHIR Server with CRID.

## Development environment setup

1. Install Node.js (https://nodejs.org/), e.g. using Homebrew:  `brew install node`
2. Install Angular CLI:  `npm install -g @angular/cli`
3. Clone git repo:  `git clone https://github.com/nmdp-bioinformatics/web-cibmtr-reporting.git`
4. Change active directory to location of git clone:  `cd web-cibmtr-reporting`
5. Select a code branch, e.g.:  `git checkout develop`
6. Install dependencies listed in package.json:  `npm install`
7. Start working with the code, run `ng` commands, etc.

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




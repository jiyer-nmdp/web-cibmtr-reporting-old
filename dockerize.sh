#!/usr/bin/env bash

docker build -t web-cibmtr-reporting . --no-cache --build-arg ENVIRONMENT=$1

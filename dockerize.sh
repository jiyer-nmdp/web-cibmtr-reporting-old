#!/usr/bin/env bash

docker build -t web-cibmtr-reporting . --no-cache --build-arg build_environment=$1

#!/usr/bin/env bash

docker build -t web-cibmtr-reporting . --build-arg build_environment=$1

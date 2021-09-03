#!/bin/bash

docker build . --build-arg -t testdb
docker run --rm testdb

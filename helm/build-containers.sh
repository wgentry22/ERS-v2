#!/bin/sh
cd ../server/ || exit 1
docker build -t ers-server .
cd ../client/ || exit 1
docker build -t ers-client .
cd ../helm/

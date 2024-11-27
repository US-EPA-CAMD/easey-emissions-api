#!/bin/bash

FILENAME=us-gov-west-1-bundle.pem
URL=https://truststore.pki.us-gov-west-1.rds.amazonaws.com/us-gov-west-1/${FILENAME}
echo "Retrieving SSL Certificate from ${URL}"
wget -O ./${FILENAME} ${URL}

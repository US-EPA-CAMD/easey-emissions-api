#!/bin/bash
FILENAME=data-dictionary.json
URL=https://${EASEY_API_GATEWAY_HOST}/content-mgmt/${FILENAME}
echo "Retrieving Data Dictionary from ${URL}"
wget -O ./${FILENAME} ${URL}

FILENAME=us-gov-west-1-bundle.pem
URL=https://truststore.pki.us-gov-west-1.rds.amazonaws.com/us-gov-west-1/${FILENAME}
echo "Retrieving SSL Certificate from ${URL}"
wget -O ./${FILENAME} ${URL}

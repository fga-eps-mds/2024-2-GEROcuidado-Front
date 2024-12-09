#!/bin/bash

source .env.development

npm install --legacy-peer-deps

rm -rf dist

echo "---------------Run migrations---------------"

npm run typeorm:run

echo "---------------Run migrations - END---------"

npm run start:debug

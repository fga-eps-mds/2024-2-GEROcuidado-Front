#!/bin/bash

echo ".................................."
echo "TEST:" $TEST

npm install --legacy-peer-deps
npm run lint
npm run typeorm:run

if ! [ -z $TEST ] && [ $TEST == 'unit' ]; then
    echo "Running unit tests"
    npm run test:cov
elif ! [ -z $TEST ] && [ $TEST == 'e2e' ]; then
    echo "Running e2e tests"
    npm run test:e2e:cov
elif ! [ -z $TEST ] && [ $TEST == 'lint' ]; then
    echo "Running lint"
    npm run lint
    npm run format
elif ! [ -z $TEST ] && [ $TEST == 'dev' ]; then
    echo "Running dev"
    npm run start:dev
fi

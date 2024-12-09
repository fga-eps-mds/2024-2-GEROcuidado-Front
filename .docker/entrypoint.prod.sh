#!/bin/sh

echo "---------------Run migrations---------------"

node /app/migrations.js

echo "---------------Run migrations - END---------"

node /app/main.js

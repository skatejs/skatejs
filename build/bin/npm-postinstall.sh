#!/bin/bash

./node_modules/.bin/bower install
cd ./node_modules/traceur && make clean && make && cd ../..

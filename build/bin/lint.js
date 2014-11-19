'use strict';

var sh = require('shelljs');

sh.exec('./node_modules/.bin/jshint build src test');
sh.exec('./node_modules/.bin/jscs build src test');

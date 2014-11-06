'use strict';

var compile = require('../lib/compile');
var sh = require('shelljs');

sh.rm('-rf', 'dist');
compile('src/skate.js', 'dist/skate.js');
sh.exec('./node_modules/.bin/uglifyjs dist/skate.js -o dist/skate.min.js');

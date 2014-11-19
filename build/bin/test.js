'use strict';

var compile = require('../lib/compile');
var sh = require('shelljs');

sh.rm('-rf', '.tmp');
compile('src/skate.js');
compile('test/unit.js', '.tmp/run-unit-tests.js');
sh.exec('./node_modules/karma/bin/karma start build/configs/karma.js --single-run');

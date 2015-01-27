'use strict';

var cmd = require('commander');
var compile = require('../lib/compile');
var fs = require('fs-extra');
var sh = require('shelljs');

cmd
  .option('-b, --browsers [browsers]', 'The browsers to run the tests in.')
  .option('-k, --keep-alive', 'Keep the test server running.')
  .parse(process.argv);

var browsers = '--browsers ' + (cmd.browsers || 'Firefox');
var keepAlive = '-' + (cmd.keepAlive && '-no-' || '-') + 'single-run';

fs.removeSync('.tmp');
fs.copySync('node_modules/weakmap', '.tmp/6to5/node_modules/weakmap');
compile('src/skate.js');
compile('test/unit.js', '.tmp/run-unit-tests.js');
sh.exec('./node_modules/karma/bin/karma start build/configs/karma.js ' + browsers + ' ' + keepAlive);

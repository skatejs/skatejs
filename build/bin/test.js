'use strict';

var cmd = require('commander');
var compile = require('../lib/compile');
var fs = require('fs-extra');
var sh = require('shelljs');
var async = require('async');

cmd
  .option('-b, --browsers [browsers]', 'The browsers to run the tests in.')
  .option('-k, --keep-alive', 'Keep the test server running.')
  .parse(process.argv);

var browsers = '--browsers ' + (cmd.browsers || 'Firefox');
var keepAlive = '-' + (cmd.keepAlive && '-no-' || '-') + 'single-run';

fs.removeSync('.tmp');
async.parallel([
  function (cb) {
    compile('./src/skate.js', 'dist/skate.js', 'skate', cb);
  },
  function (cb) {
    compile('./test/unit.js', '.tmp/run-unit-tests.js', null, cb);
  }
], function (err) {
  if (err) {
    throw err;
  }

  sh.exec('./node_modules/karma/bin/karma start build/configs/karma.js ' + browsers + ' ' + keepAlive);
});

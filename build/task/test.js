'use strict';

var assign = require('lodash/object/assign');
var buildTest = require('./build-test');
var commander = require('../lib/commander');
var Server = require('karma').Server;

commander
  .option('-b, --browsers [Chrome,Firefox]', 'The browsers to run the tests in.')
  .option('-g, --grep [pattern]', 'The grep pattern matching the tests you want to run.')
  .option('-h, --host [localhost]', 'The host to listen on.')
  .option('-p, --port [9876]', 'The port to listen on.')
  .parse(process.argv);

module.exports = function (opts, done) {
  var args = [];
  opts = assign({
    singleRun: true,
    watch: false,
    browsers: ['Firefox', 'Chrome'].join(',')
  }, opts);

  if (opts.grep) {
    args.push('--grep');
    args.push(opts.grep);
  }

  var config = {
    autoWatch: opts.watch,
    browsers: opts.browsers.split(','),
    client: { args: args },
    frameworks: ['mocha', 'sinon-chai'],
    singleRun: opts.singleRun,
    files: [
      '.tmp/unit.js'
    ]
  };

  if (opts.saucelabs) {
    var saucelabsLaunchers = require('../lib/saucelabs-launchers');
    config = assign(config, {
      sauceLabs: {
        testName: 'Skate unit tests (0.13.x)',
        recordScreenshots: false,
        connectOptions: {
          verbose: true,
          verboseDebugging: true
        }
      },
      customLaunchers: saucelabsLaunchers,
      browsers: Object.keys(saucelabsLaunchers),
      captureTimeout: 120000,
      reporters: ['saucelabs', 'dots'],
      autoWatch: false,
      concurrency: 5,
      client: {}
    });
  }

  buildTest(opts)
    .on('error', function (e) {
      throw e;
    })
    .on('end', function () {
      new Server(config, function finishTaskAndExit (exitCode) {
        done();
        process.exit(exitCode);
      }).start();
    });
};

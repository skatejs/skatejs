<<<<<<< HEAD
'use strict';

var commander = require('../lib/commander');
var galvatron = require('galvatron');
var gulp = require('gulp');
var karma = require('karma').server;

commander
  .option('-b, --browsers [Chrome,Firefox]', 'The browsers to run the tests in.')
  .option('-g, --grep [pattern]', 'The grep pattern matching the tests you want to run.')
  .option('-h, --host [localhost]', 'The host to listen on.')
  .option('-p, --port [9876]', 'The port to listen on.')
  .parse(process.argv);

galvatron.transformer
  .post('babel')
  .post('globalize');

var clientArgs = [];

if (commander.grep) {
  clientArgs.push('--grep');
  clientArgs.push(commander.grep);
}

function run () {
  karma.start({
    autoWatch: !!commander.watch,
    singleRun: !commander.watch,
    hostname: commander.host || '0.0.0.0',
    port: commander.port || 9876,
    frameworks: ['mocha', 'sinon-chai'],
    browsers: (commander.browsers || 'Firefox').split(','),
    client: { args: clientArgs },
    files: [ '.tmp/unit.js' ]
  });
}

module.exports = function () {
  var bundle = galvatron.bundle('test/unit.js');

  if (commander.watch) {
    run();
  }

  gulp.src(bundle.files)
    .pipe(bundle.watchIf(commander.watch))
    .pipe(bundle.stream())
    .pipe(gulp.dest('.tmp'))
    .on('finish', run);
};
=======
var assign = require('lodash/object/assign');
var Server = require('karma').Server;

function Test(opts, done) {
  var args = [];
  opts = assign({
    browsers: 'Firefox'
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
    singleRun: true,
    files: [
      '.tmp/unit.js'
    ]
  };

  if (opts.saucelabs) {
    var saucelabsLaunchers = require('./saucelabsLaunchers');
    config = assign(config, {
      saucelabs: {
        testName: 'Skate unit tests',
        recordScreenshots: false
      },
      customLaunchers: saucelabsLaunchers,
      browsers: Object.keys(saucelabsLaunchers),
      captureTimeout: 120000,
      reporters: ['saucelabs'],
      autoWatch: false,
      client: {}
    });
  }

  new Server(config, done).start();
}

Test.deps = ['build-test'];

module.exports = Test;
>>>>>>> 47d3ed1... add SauceLabs automated tests

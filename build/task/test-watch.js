'use strict';

var gulpWatch = require('gulp-watch');
var test = require('./test');
var buildTest = require('./build-test');
var _ = require('lodash');
var commander = require('../lib/commander');

commander
  .option('-b, --browsers [Chrome,Firefox]', 'The browsers to run the tests in.')
  .option('-g, --grep [pattern]', 'The grep pattern matching the tests you want to run.')
  .option('-h, --host [localhost]', 'The host to listen on.')
  .option('-p, --port [9876]', 'The port to listen on.')
  .parse(process.argv);

module.exports = function (opts, done) {
  var startKarmaWatch = _.once(function () {
    opts.watch = true;
    opts.singleRun = false;
    test(opts, done);
  });

  gulpWatch(['src/**', 'test/**'], function () {
    buildTest(opts)
      .on('error', function (e) {
        throw e;
      })
      .on('end', startKarmaWatch);
  });
};

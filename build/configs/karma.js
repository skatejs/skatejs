'use strict';

var cmd = require('commander')
  .option('-b', '--browsers [browsers]', 'Comma separated list of browsers to test with.')
  .option('-h', '--host [host]', 'The host to listen on.')
  .option('-k', '--keepalive', 'Whether or not to keep the server alive.')
  .option('-p', '--port [port]', 'The port to listen on.')
  .parse(process.argv);

var browsers = 'Firefox';

if (!cmd.keepalive && cmd.browsers) {
  browsers = cmd.browsers;
}

module.exports = function (config) {
  config.set({
    basePath: '../..',

    browsers: browsers.split(','),

    files: [
      { pattern: '.tmp/run-unit-tests.js', included: true }
    ],

    frameworks: [
      'mocha',
      'chai'
    ],

    hostname: cmd.host || 'localhost',

    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-mocha'
    ],

    port: cmd.port || '9876',

    reporters: [
      'progress'
    ],

    singleRun: !cmd.keepalive
  });
};

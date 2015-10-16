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

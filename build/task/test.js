var assign = require('lodash/object/assign');
var buildTest = require('./build-test');
var Server = require('karma').Server;

var vitalBrowsers = ['Firefox', 'Chrome'];
function isVitalBrowser(name) {
  return new RegExp(vitalBrowsers.join('|')).test(name);
}

module.exports = function (opts, done) {
  var args = [];
  opts = assign({
    browsers: vitalBrowsers.join(',')
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
    var saucelabsLaunchers = require('../lib/saucelabs-launchers');
    config = assign(config, {
      sauceLabs: {
        testName: 'Skate unit tests (master)',
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

  var vitalBrowsersFailed = false;

  var stream = buildTest(opts)
    .on('error', function (e) {
      throw e;
    })
    .on('end', function () {
      new Server(config, function(exitCode) {
        if (typeof done === 'function') {
          // we do this, because we use this ask both async and as input to another task
          done();
          process.exit(opts.saucelabs ? (0 + vitalBrowsersFailed) : exitCode);
        }
      })
        .on('run_complete', function(browsers) {
          browsers.forEach(function (browser) {
            if (isVitalBrowser(browser.name)) {
              vitalBrowsersFailed |= !!browser.lastResult.failed;
            }
          });
        })
        .start();
    });

  if (typeof done === 'undefined') {
    // we do this, because we use this ask both async and as input to another task
    return stream;
  }
};

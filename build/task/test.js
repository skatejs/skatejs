var assign = require('lodash/object/assign');
var buildTest = require('./build-test');
var Server = require('karma').Server;

var vitalBrowsers = ['Firefox', 'Chrome'];
function isVitalBrowser(name) {
  return new RegExp(vitalBrowsers.join('|')).test(name);
}

module.exports = function (opts) {
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

  return buildTest(opts)
    .on('error', function (e) {
      throw e;
    })
    .on('end', function () {
      new Server(config, function() {
        /* we can use the exitCode parameter in the future when all our tests passed once */
        process.exit(0 + vitalBrowsersFailed);
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
};

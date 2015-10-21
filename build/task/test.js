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
    singleRun: true,
    watch: false,
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
    singleRun: opts.singleRun,
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
      reporters: ['saucelabs', 'dots'],
      autoWatch: false,
      client: {}
    });
  }

  var vitalBrowsersFailed = false;

  function runKarma (done) {
    new Server(config, function onKarmaEnd (exitCode) {
      done(exitCode);
    })
      .on('run_complete', function onRunComplete (browsers) {
        browsers.forEach(function eachBrowser (browser) {
          if (isVitalBrowser(browser.name)) {
            vitalBrowsersFailed = vitalBrowsersFailed || !!browser.lastResult.failed;
          }
        });
      })
      .start();
  }

  buildTest(opts)
    .on('error', function (e) {
      throw e;
    })
    .on('end', function () {
      runKarma(function finishTaskAndExit (exitCode) {
        done();
        process.exit(opts.saucelabs ? (0 + vitalBrowsersFailed) : exitCode);
      });
    });
};

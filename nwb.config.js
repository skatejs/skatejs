const browsers = require('./test/browsers');

module.exports = {
  type: 'web-module',
  npm: {
    esModules: true,
    umd: true
  },
  karma: process.argv.indexOf('--ci') === -1 ? {
    browsers: [require('karma-chrome-launcher')]
  } : {
    sauceLabs: {},
    customLaunchers: browsers,
    browsers: Object.keys(browsers),
    retryLimit: 3,
    reporters: ['dots', 'saucelabs'],
    autoWatch: false,
    concurrency: 4,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 5,
    captureTimeout: 120000
  }
};

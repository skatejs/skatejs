const browsers = require('./test/browsers');

module.exports = {
  type: 'web-module',
  npm: {
    cjs: false,
    esModules: true,
    umd: {
      externals: { preact: 'preact' },
      global: 'skate'
    }
  },
  karma: process.argv.indexOf('--ci') === -1 ? {
    browsers: [require('karma-chrome-launcher')]
  } : {
    browsers: Object.keys(browsers),
    plugins: ['karma-sauce-launcher'],
    reporters: ['saucelabs'],
    extra: {
      sauceLabs: {},
      customLaunchers: browsers,
      retryLimit: 3,
      autoWatch: false,
      concurrency: 4,
      browserDisconnectTimeout: 10000,
      browserDisconnectTolerance: 5,
      captureTimeout: 120000
    }
  },
  babel: {
    presets: ['react']
  }
};

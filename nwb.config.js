const externals = require('webpack-node-externals');
const yargs = require('yargs');

const browsers = require('./test/browsers');

const [ cmd ] = yargs.argv._;
const isBuild = cmd === 'build';

module.exports = {
  type: 'web-module',
  npm: {
    // CJS is kinda useless if we have UMD.
    cjs: false,

    // We also create a custom ES build using straight-up babel because we can't
    // have different babel configs for different parts of NWB's builds.
    esModules: true,

    // Node and browsers.
    umd: {
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
  },
  webpack: {
    extra: {
      externals: isBuild ? [externals()] : []
    }
  }
};

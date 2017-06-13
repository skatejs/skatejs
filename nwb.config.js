const externals = require('webpack-node-externals');
const yargs = require('yargs');

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
  babel: {
    presets: ['react']
  },
  webpack: {
    extra: {
      externals: isBuild ? [externals()] : []
    }
  }
};

const babel = require('babel-core');
const externals = require('webpack-node-externals');
const fs = require('fs');
const glob = require('glob');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');
const yargs = require('yargs');

const browsers = require('./test/browsers');

const [ cmd ] = yargs.argv._;
const isBuild = cmd === 'build';
const babelConfig = {
  plugins: ['transform-react-jsx']
};

if (isBuild) {
  const files = glob.sync('src/**/*.js');
  rimraf.sync('./es');
  files.forEach(f => {
    const { code } = babel.transformFileSync(f, Object.assign({}, babelConfig, {
      presets: ['stage-0', 'es2017', 'es2016']
    }));
    const target = f.replace('src/', 'es/');
    const targetDir = path.dirname(target);
    mkdirp.sync(targetDir);
    fs.writeFileSync(target, code);
  });
}

module.exports = {
  type: 'web-module',
  npm: {
    // CJS is kinda useless if we have UMD.
    cjs: false,

    // We create a custom ESBuild above.
    esModules: false,

    // This is what Node and browsers will consume.
    umd: {
      global: 'skate'
    }
  },
  karma: process.argv.indexOf('--ci') === -1 ? {
    // Local dev.
    browsers: [require('karma-chrome-launcher')]
  } : {
    // TravisCI (SauceLabs)
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
  // This specifies the config for all transforms:
  //
  // - CJS - ES5 via Babel using require / module.exoorts.
  // - ESM - Same as CJS but with ESM import / export instead.
  // - UMD - WebPack
  //
  // In order to have different Babel configs (ES latest + UMD) we must only
  // use this for UMD and have to have some imperative stuff for Babel above
  // to share the config, otherwise we dupe this.
  babel: babelConfig,

  // WebPack is used for the UMD build only.
  webpack: {
    extra: {
      externals: isBuild ? [externals()] : []
    }
  }
};

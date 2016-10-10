const base = require('skatejs-build/karma.conf');
const webpackConfig = require('./webpack.config');
module.exports = (config) => {
  base(config);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;

  // Since we override the Webpack config, we must make sure Karma gets it.
  config.webpack = Object.assign({}, config.webpack, webpackConfig, {
    entry: undefined,
  });
};

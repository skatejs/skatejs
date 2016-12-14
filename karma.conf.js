/**
 * TIP: easy way to test locally with multiple browsers
 * use command: sk-tests-watch --browsers Chrome,Firefox
 */

const base = require('skatejs-build/karma.conf');
const webpackConfig = require('./webpack.config');
const webpack = require('webpack');

module.exports = (config) => {
  base(config);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;

  // Override process.env.NODE_ENV
  webpackConfig.plugins[1] = new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('test')
    }
  });

  // Since we override the Webpack config, we must make sure Karma gets it.
  config.webpack = Object.assign({}, config.webpack, webpackConfig, {
    entry: undefined
  });
};

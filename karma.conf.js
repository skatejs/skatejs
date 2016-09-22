const base = require('skatejs-build/karma.conf');
const webpackConfig = require('./webpack.config');
module.exports = (config) => {
  base(config);

  config.files = [
    // React
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591530_1796350410598576_924751100_n.js',

    // React DOM
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591520_511026312439094_2118166596_n.js',
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;

  // Since we override the Webpack config, we must make sure Karma gets it.
  config.webpack = Object.assign({}, config.webpack, webpackConfig, {
    entry: undefined,
  });
};

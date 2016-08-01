const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);

  config.files = [
    // React
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591530_1796350410598576_924751100_n.js',

    // React DOM
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591520_511026312439094_2118166596_n.js',
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

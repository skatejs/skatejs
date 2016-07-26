const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);

  // Setup IE if testing in SauceLabs.
  if (config.sauceLabs) {
    // Remove all explicit IE definitions.
    config.browsers = config.browsers.filter(name => !/^internet_explorer/.test(name));

    // Only test IE latest.
    config.browsers.push('internet_explorer_11');
  }

  config.files = [
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591530_1796350410598576_924751100_n.js',
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591520_511026312439094_2118166596_n.js',
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

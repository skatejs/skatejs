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

  // Shims for testing.
  config.files = [
    'https://npmcdn.com/webcomponents.js/CustomElements.js'
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

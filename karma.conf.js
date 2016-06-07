const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);

  // Remove all explicit IE definitions.
  config.browsers = config.browsers.filter(name => !/^internet_explorer/.test(name));

  // Only test IE latest.
  config.browsers.push('internet_explorer_latest');

  // Shims for testing.
  config.files = [
    'node_modules/es6-shim/es6-shim.js'
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

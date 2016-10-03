const base = require('skatejs-build/karma.conf');
module.exports = (config) => {
  base(config);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

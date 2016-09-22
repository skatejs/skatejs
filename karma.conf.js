const base = require('skatejs-build/karma.conf');
module.exports = (config) => {
  base(config);

  config.files = [
    'bower_components/react/react.min.js',
    'bower_components/react/react-dom.min.js',
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

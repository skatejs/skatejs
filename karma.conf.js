const base = require('skatejs-build/karma.conf');

module.exports = function (config) {
  base(config);
  const polyfillV0 = process.argv.indexOf('--v0') !== -1;

  // Setup IE if testing in SauceLabs.
  if (config.sauceLabs) {
    // Remove all explicit IE definitions.
    config.browsers = config.browsers.filter(name => !/^internet_explorer/.test(name));

    // Only test IE latest.
    config.browsers.push('internet_explorer_11');
  }

  config.preprocessors['test/polyfill.v1.js'] = [ 'webpack' ];
  config.preprocessors['test/polyfill.v0.js'] = [ 'webpack' ];

  // Shims for testing.
  const additionalFiles = ['node_modules/es6-shim/es6-shim.js'];

  if (polyfillV0) {
    additionalFiles.push('test/polyfill.v0.js');
  } else {
    additionalFiles.push('test/polyfill.v1.js');
  }

  config.files = additionalFiles.concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

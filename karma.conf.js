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
  var polyOptions = process.argv.filter((val) => {
    return val.search('--polyfills=') == 0;
  });

  polyOptions = polyOptions[0].replace('--polyfills=', '');
  polyOptions = polyOptions.split(',');

  const polyFiles = [];

  if (polyOptions.indexOf('dom1') >- 1) {
    polyFiles.push(require.resolve('skatejs-named-slots'));
  } else {
    polyFiles.push(require.resolve('webcomponents.js/ShadowDOM'));
  }

  if (polyOptions.indexOf('elem1') > -1) {
    polyFiles.push('https://npmcdn.com/webcomponents.js@0.7.22#fb43208/src/CustomElements/CustomElements.js');
  } else {
    polyFiles.push(require.resolve('webcomponents.js/CustomElements'));
  }

  config.files = polyFiles.concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

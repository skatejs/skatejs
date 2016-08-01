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

  if (polyOptions && polyOptions.length) {
    polyOptions = polyOptions[0].replace('--polyfills=', '');
    polyOptions = polyOptions.split(',');
  }

  const polyFiles = [];

  if (polyOptions.indexOf('dom0') >- 1) {
    polyFiles.push(require.resolve('webcomponents.js/ShadowDOM'));
  } else {
    polyFiles.push(require.resolve('skatejs-named-slots'));
  }

  // There is no option for the v1 Custom Element polyfill, since it's unstable
  polyFiles.push(require.resolve('webcomponents.js/CustomElements'));

  config.files = polyFiles.concat(config.files);

  config.files = [
    // React
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591530_1796350410598576_924751100_n.js',

    // React DOM
    'https://scontent.xx.fbcdn.net/t39.3284-6/13591520_511026312439094_2118166596_n.js',
  ].concat(config.files);

  // Ensure mobile browsers have enough time to run.
  config.browserNoActivityTimeout = 60000;
};

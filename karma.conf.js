const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);
  config.files = (function () {
    if (process.argv.indexOf('--webcomponentsjs') > -1) {
      return ['node_modules/webcomponents.js/webcomponents.js'];
    } else if (process.argv.indexOf('--named-slots') > -1) {
      return ['node_modules/skatejs-named-slots/dist/index.js', 'node_modules/webcomponents.js/MutationObserver.js'];
    }
    return ['node_modules/webcomponents.js/MutationObserver.js'];
  }()).concat(config.files);
};

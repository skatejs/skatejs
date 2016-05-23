const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);
  config.files = ['node_modules/webcomponents.js/MutationObserver.js'].concat(config.files);
  config.browserNoActivityTimeout = 60000;
};

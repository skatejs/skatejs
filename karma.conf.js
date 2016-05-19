const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);
  config.files.push('node_modules/webcomponents.js/MutationObserver.js');
};

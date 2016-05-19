const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);
  config.files = [
    'node_modules/skatejs-named-slots/dist/index.js'
    // 'node_modules/webcomponents.js/webcomponents.js'
  ].concat(config.files);
};

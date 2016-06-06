const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);
  config.files = [
    'node_modules/es6-shim/es6-shim.js'
  ].concat(config.files);
  config.browserNoActivityTimeout = 60000;
};

const base = require('skatejs-build/karma.conf');
module.exports = function (config) {
  base(config);
  config.set({
    files: [
      'node_modules/webcomponentsjs/MutationObserver.js'
    ]
  });
};

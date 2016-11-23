module.exports = require('skatejs-build/rollup.config');
module.exports.globals = {
  'incremental-dom': 'IncrementalDOM',
  'window-or-global': 'windowOrGlobal'
};

console.log('>>> rollup', module.exports.plugins[0]);

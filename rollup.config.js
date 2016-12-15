const replace = require('rollup-plugin-replace');

module.exports = require('skatejs-build/rollup.config');
module.exports.globals = {
  'incremental-dom': 'IncrementalDOM',
  'window-or-global': 'windowOrGlobal'
};
module.exports.plugins.push(replace({
  DEBUG: JSON.stringify(false)
}));

module.exports = require('skatejs-build/rollup.config');
module.exports.globals = {
  'incremental-dom': 'IncrementalDOM',
  'regex-native-function': 'isNativeRegex',
  'window-or-global': 'windowOrGlobal'
};

module.exports = require('skatejs-build/rollup.config');
module.exports.globals = {
  'incremental-dom': 'IncrementalDOM',
  'window-or-global': 'windowOrGlobal'
};

import typescript from 'rollup-plugin-typescript';
module.exports.plugins.push(typescript());

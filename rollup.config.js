module.exports = require('skatejs-build/rollup.config');
module.exports.globals = {
  'incremental-dom': 'IncrementalDOM',
  'window-or-global': 'windowOrGlobal'
};

import rollupPluginTypescript from 'rollup-plugin-typescript';
// Note: rollup-plugin-typescript must be first in the plugins array
module.exports.plugins.unshift(rollupPluginTypescript({
  typescript: require('typescript')
}));


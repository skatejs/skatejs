module.exports = require('skatejs-build/rollup.config');
module.exports.globals = {
  'incremental-dom': 'IncrementalDOM',
  'window-or-global': 'windowOrGlobal'
};

// This should be part of the default skatejs/build
const rollupBabel = require('rollup-plugin-babel');
const presetEs2015 = require('babel-preset-es2015-rollup');
const babel = rollupBabel({
  presets: presetEs2015,
  plugins: ['transform-flow-strip-types']
});
module.exports.plugins[0] = babel;

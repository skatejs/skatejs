const {
  createConfig,
  env,
  entryPoint,
  setOutput,
  sourceMaps
} = require('@webpack-blocks/webpack2');
const babel = require('@webpack-blocks/babel6');
const webpackNodeExternals = require('webpack-node-externals');
const prod = process.argv.indexOf('-p') > -1;

function entries (userDefinedEntries) {
  const src = './src/index.js';
  return entryPoint((() => {
    if (userDefinedEntries) {
      return userDefinedEntries;
    }
    if (prod) {
      return {
        'dist/index-with-deps.min.js': src
      };
    }
    return {
      'dist/index.js': src,
      'dist/index-with-deps.js': src
    };
  })());
}

function externals (userDefinedExternals) {
  return () => ({
    externals: userDefinedExternals || webpackNodeExternals()
  });
}

module.exports = createConfig([
  babel(),
  entries({
    'dist/index.js': './src/index.js'
  }),
  externals(prod ? null : []),
  setOutput({
    filename: '[name]',
    library: 'skate',
    libraryTarget: 'umd',
    path: './',
    sourceMapFilename: '[file].map'
  })
]);

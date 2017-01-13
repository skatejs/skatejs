const { entryPoint, group, setOutput, sourceMaps } = require('@webpack-blocks/webpack2');
const babel = require('@webpack-blocks/babel6');
const path = require('path');

function min () {
  return prod() ? '.min' : '';
}

function pack () {
  return require(path.join(process.cwd(), 'package.json'));
}

function prod () {
  return process.argv.indexOf('-p') > -1;
}

function entries () {
  return entryPoint({
    [`dist/index${min()}.js`]: './src/index.js'
  });
}

function entriesWithDeps () {
  return entryPoint({
    [`dist/index-with-deps${min()}.js`]: './src/index.js'
  });
}

function externals () {
  const {
    dependencies,
    devDependencies,
    optionalDependencies,
    peerDependencies
  } = pack();
  return () => ({
    externals: Object.keys(
      Object.assign(
        {},
        dependencies,
        devDependencies,
        optionalDependencies,
        peerDependencies
      )
    )
  });
}

function output (userDefinedOutput) {
  const { name } = pack();
  const temp = Object.assign({}, {
    filename: '[name]',
    library: name,
    libraryTarget: 'umd',
    path: './',
    sourceMapFilename: '[file].map'
  }, userDefinedOutput);
  return setOutput(temp);
}

// Preset for generating a bundle with only the src files.
function main () {
  return group([
    babel(),
    entries(),
    externals(),
    output(),
    sourceMaps()
  ]);
}

// Preset for generating a bundle including the dependencies.
function bundle () {
  return group([
    babel(),
    entriesWithDeps(),
    output(),
    sourceMaps()
  ]);
}

module.exports = {
  bundle,
  entries,
  externals,
  main,
  output
};

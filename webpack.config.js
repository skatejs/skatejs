const conf = module.exports = require('skatejs-build/webpack.config');
conf.devtool = 'source-map';
conf.entry = {
  'dist/index-with-deps.js': './src/index.js',
  'dist/index-with-deps.min.js': './src/index.js',
};
conf.output.library = 'skate';

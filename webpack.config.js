module.exports = require('skatejs-build/webpack.config');
module.exports.module.loaders[2].query.plugins = ['transform-class-properties'];

const path = require('path');
module.exports.resolve = {
  root: path.resolve('./src'),
  extensions: ['', '.js', '.ts']
};
module.exports.module.loaders.push(
  {
    test: /\.ts$/,
    loader: 'ts',
    exclude: /node_modules/
  }
);

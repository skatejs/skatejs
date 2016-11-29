module.exports = require('skatejs-build/webpack.config');
module.exports.module.loaders[2].query.plugins = ['transform-class-properties'];

// Resolve .ts files
module.exports.resolve = {
  extensions: ['', '.js', '.ts']
};

// ts-loader
module.exports.module.loaders.push(
  {
    test: /\.ts$/,
    loader: 'ts',
    exclude: /node_modules/
  }
);

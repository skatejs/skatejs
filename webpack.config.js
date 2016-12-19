const webpack = require('webpack');

module.exports = require('skatejs-build/webpack.config');
module.exports.module.loaders[2].query.plugins = ['transform-class-properties'];
module.exports.plugins[1] = new webpack.DefinePlugin({
  DEBUG: JSON.stringify(false)
});

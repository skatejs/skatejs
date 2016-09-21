module.exports = require('skatejs-build/webpack.config');
module.exports.module.loaders[2].query.plugins = ['transform-class-properties'];

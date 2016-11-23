module.exports = require('skatejs-build/webpack.config');
console.log('>>> webpack plugins before', module.exports.module.loaders[2].query.plugins);
module.exports.module.loaders[2].query.plugins = ['transform-class-properties', 'transform-flow-strip-types'];
console.log('>>> webpack plugins after', module.exports.module.loaders[2].query.plugins);

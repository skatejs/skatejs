module.exports = require('skatejs-build/webpack.config');
console.log('>>> webpack plugins before', module.exports.module.loaders[2].query.plugins);
module.exports.module.loaders[2].query.plugins = ['transform-flow-strip-types', 'transform-class-properties'];
console.log('>>> webpack plugins after', module.exports.module.loaders[2].query.plugins);

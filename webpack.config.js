module.exports = require('skatejs-build/webpack.config');
module.exports.module.loaders[2].exclude = /node_modules\/(?![skatejs-named-slots|webcomponents\.js])/;

const { createConfig } = require('@webpack-blocks/webpack2');
const { bundle } = require('./webpack-blocks');

module.exports = createConfig([ bundle() ]);

const { createConfig } = require('@webpack-blocks/webpack2');
const { main } = require('./webpack-blocks');

module.exports = createConfig([ main() ]);

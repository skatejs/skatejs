const conf = module.exports = require('skatejs-build/rollup.config');
const pack = require('./package.json');
const deps = Object.keys(pack.dependencies);
conf.external = id => deps.indexOf(id) > -1;

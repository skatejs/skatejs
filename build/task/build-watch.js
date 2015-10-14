var galv = require('galvatron');
var build = require('./build');

module.exports = function () {
  galv.watch(['src/**'], build);
};

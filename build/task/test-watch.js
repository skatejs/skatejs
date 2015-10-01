var galv = require('galvatron');
var test = require('./test');

module.exports = function (opts) {
  galv.watch(['src/**', 'test/**'], function () {
    test(opts).on('error', function(){});
  });
};

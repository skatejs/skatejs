var galv = require('galvatron');
var test = require('./test');

module.exports = function (opts, done) {
  galv.watch(['src/**', 'test/**'], function () {
    test(opts, function() {}).on('error', function(){});
  });
};

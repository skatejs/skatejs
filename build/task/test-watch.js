var galv = require('galvatron');
var test = require('./test');
var buildTest = require('./build-test');
var _ = require('lodash');



module.exports = function (opts, done) {
  var startKarmaWatch = _.once(function () {
    opts.watch = true;
    opts.singleRun = false;
    test(opts, done);
  });

  galv.watch(['src/**', 'test/**'], function () {
    buildTest(opts)
      .on('error', function (e) {
        throw e;
      })
      .on('end', startKarmaWatch);
  });
};

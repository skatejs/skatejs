var galv = require('galvatron');
var assign = require('lodash/object/assign');
var test = require('./test');

module.exports = function () {
  galv.watch('test/**', function (opts) {
    test(assign(opts || {}, {
      action: 'watch'
    }));
  });
};

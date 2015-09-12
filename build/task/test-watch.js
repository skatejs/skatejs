var galv = require('galvatron');
var assign = require('lodash/object/assign');
var test = require('./test');

module.exports = function (opts) {
  galv.watch('test/**', function () {
    test(opts).on('error', function(){});
  });
};

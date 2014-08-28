(function () {
  'use strict';

  var files = window.__karma__.files;
  var start = window.__karma__.start;
  var tests = [];

  Object.keys(files).forEach(function (file) {
    if (file.indexOf('/unit/') > -1) {
      tests.push(file);
    }
  });

  require([
    '/base/src/skate.js',
    '/base/test/lib/helpers.js'
  ], function (
    skate,
    helpers
  ) {
    afterEach(function () {
      skate.destroy();
      helpers.fixture('');
    });

    require(tests, start);
  });
}());

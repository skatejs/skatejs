var files = window.__karma__.files;
var start = window.__karma__.start;
var tests = [];

Object.keys(files).forEach(function (file) {
  if (file.indexOf('/unit/') > -1) {
    tests.push(file);
  }
});

require(['/base/src/skate.js'], function (skate) {
  afterEach(skate.destroy);
  require(tests, start);
});

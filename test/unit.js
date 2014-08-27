var files = window.__karma__.files;
var tests = [];
for (var file in files) {
  if (files.hasOwnProperty(file)) {
    if (file.indexOf('/unit/') > -1) {
      tests.push(file);
    }
  }
}

require({
  baseUrl: '/base/',
  callback: window.__karma__.start,
  deps: tests
});

afterEach(function () {
  skate.destroy();
});

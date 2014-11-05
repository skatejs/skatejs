module.exports = function (src, dest) {
  var cmd = require('./cmd');
  var path = require('path');

  return cmd(
    'rm -rf .tmp/6to5',
    'mkdir -p .tmp/6to5',
    './node_modules/.bin/6to5 ' + path.dirname(src) + ' --out-dir .tmp/6to5',
    'mkdir -p ' + path.dirname(dest),
    './node_modules/.bin/browserify .tmp/6to5/' + path.basename(src) + ' -o ' + dest
  );
};

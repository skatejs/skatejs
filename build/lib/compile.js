module.exports = function (src, dest) {
  var cmd = require('./cmd');
  var path = require('path');
  var base = '.tmp/6to5/' + path.dirname(src);

  return cmd(
    'rm -rf ' + base,
    'mkdir -p ' + base,
    './node_modules/.bin/6to5 ' + path.dirname(src) + ' --out-dir ' + base,
    dest && cmd(
      'mkdir -p ' + path.dirname(dest),
      './node_modules/.bin/browserify .tmp/6to5/' + src + ' -o ' + dest
    )
  );
};

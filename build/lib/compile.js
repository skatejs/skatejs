module.exports = function (src, dest) {
  var path = require('path');

  return '' +
    'node' +
    ' ./node_modules/6to5/bin/6to5/index.js ' + path.dirname(src) +
    ' --out-dir .tmp/6to5' +
    ' &&' +
    ' mkdir -p ' + path.dirname(dest) +
    ' &&' +
    ' node ./node_modules/browserify/bin/cmd.js .tmp/6to5/' + path.basename(src) +
    ' -o ' + dest;
};

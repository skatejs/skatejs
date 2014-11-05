module.exports = function (dir, file, dest) {
  return '' +
    'node' +
    ' ./node_modules/6to5/bin/6to5/index.js ' + dir +
    ' --out-dir .tmp/6to5' +
    ' &&' +
    ' mkdir -p "$(dirname "' + dest + '")"' +
    ' &&' +
    ' node ./node_modules/browserify/bin/cmd.js .tmp/6to5/' + file +
    ' -o ' + dest;
};

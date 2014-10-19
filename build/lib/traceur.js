module.exports = function (src, dest) {
  return '' +
    './node_modules/traceur/traceur --modules=inline' +
    ' --out ' + dest +
    ' --module ' + src;
};

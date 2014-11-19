'use strict';

var fs = require('fs');

module.exports = function (file, pattern, replacement) {
  var str = fs.readFileSync(file).toString();
  str = str.replace(pattern, replacement);
  fs.writeFileSync(file, str);
};

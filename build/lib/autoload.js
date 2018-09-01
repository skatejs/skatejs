const fs = require('fs');
const path = require('path');
const tsNode = require('ts-node');

tsNode.register();

module.exports = function autoload(dir) {
  return fs
    .readdirSync(dir)
    .filter(f => f.isDir)
    .reduce((prev, next) => {
      const name = path.basename(next).split('.')[0];
      prev[name] = require(next);
    }, {});
};

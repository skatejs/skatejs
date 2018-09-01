const fs = require('fs');
const path = require('path');
const tsNode = require('ts-node');

tsNode.register();

module.exports = function autoload(dir) {
  dir = path.join(process.cwd(), dir);
  return fs
    .readdirSync(dir)
    .filter(file => path.basename(file).indexOf('.') > -1)
    .reduce((prev, next) => {
      const name = path.basename(next).split('.')[0];
      const exported = require(path.join(dir, next));
      prev[name] = exported.default || exported;
      return prev;
    }, {});
};

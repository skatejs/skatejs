var del = require('del');

module.exports = function () {
  return del(['.tmp', 'dist', 'lib']);
};

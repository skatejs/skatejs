'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.name = name;

var _util = require('./util');

function format(prefix, suffix) {
  return (
    (prefix.indexOf('-') === -1 ? `x-${prefix}` : prefix) +
    (suffix ? `-${suffix}` : '')
  );
}

function name(prefix = 'element') {
  prefix = (0, _util.dashCase)(prefix);
  let suffix = 0;
  while (customElements.get(format(prefix, suffix))) ++suffix;
  return format(prefix, suffix);
}

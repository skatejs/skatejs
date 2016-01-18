(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../../util/empty'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../../util/empty'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.empty);
    global.number = mod.exports;
  }
})(this, function (exports, module, _utilEmpty) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _empty = _interopRequireDefault(_utilEmpty);

  var alwaysUndefinedIfEmpty = function alwaysUndefinedIfEmpty(val) {
    return (0, _empty['default'])(val) ? undefined : Number(val);
  };

  module.exports = {
    coerce: alwaysUndefinedIfEmpty,
    deserialize: alwaysUndefinedIfEmpty,
    serialize: alwaysUndefinedIfEmpty
  };
});
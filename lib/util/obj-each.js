(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './has-own'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./has-own'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.hasOwn);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _hasOwn) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _hasOwn2 = _interopRequireDefault(_hasOwn);

  module.exports = function (obj, fn) {
    for (var a in obj) {
      if ((0, _hasOwn2['default'])(obj, a)) {
        fn(obj[a], a);
      }
    }
  };
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../polyfill/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../polyfill/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.registry);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _polyfillRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _registry = _interopRequireDefault(_polyfillRegistry);

  module.exports = function (name) {
    var Ctor = _registry['default'].get(name);
    return Ctor && new Ctor() || document.createElement(name);
  };
});
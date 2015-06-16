(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign', '../polyfill/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign'), require('../polyfill/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.registry);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _utilAssign, _polyfillRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_utilAssign);

  var _registry = _interopRequireDefault(_polyfillRegistry);

  module.exports = function (name, props) {
    var ctor = _registry['default'].get(name);
    return ctor && ctor(props) || (0, _assign['default'])(document.createElement(name), props);
  };
});
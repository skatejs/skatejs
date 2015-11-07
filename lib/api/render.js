(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../global/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.registry);
    global.render = mod.exports;
  }
})(this, function (exports, module, _globalRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _registry = _interopRequireDefault(_globalRegistry);

  module.exports = function (elem) {
    _registry['default'].find(elem).forEach(function (component) {
      return component.render && component.render(elem);
    });
  };
});
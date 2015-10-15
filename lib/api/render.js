(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../global/registry', '../lifecycle/renderer'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../global/registry'), require('../lifecycle/renderer'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.registry, global.renderer);
    global.render = mod.exports;
  }
})(this, function (exports, module, _globalRegistry, _lifecycleRenderer) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _registry = _interopRequireDefault(_globalRegistry);

  var _renderer = _interopRequireDefault(_lifecycleRenderer);

  module.exports = function (elem) {
    _registry['default'].find(elem).forEach(function (component) {
      return (0, _renderer['default'])(elem, component);
    });
  };
});
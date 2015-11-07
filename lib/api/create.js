(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'object-assign', '../global/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('object-assign'), require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.registry);
    global.create = mod.exports;
  }
})(this, function (exports, module, _objectAssign, _globalRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_objectAssign);

  var _registry = _interopRequireDefault(_globalRegistry);

  module.exports = function (name, properties) {
    var trimmedName = name.trim();
    var constructor = _registry['default'].get(trimmedName);
    return constructor ? constructor(properties) : (0, _assign['default'])(document.createElement(trimmedName), properties);
  };
});
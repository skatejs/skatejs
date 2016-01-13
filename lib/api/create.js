(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', 'object-assign', './init', '../global/registry'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('object-assign'), require('./init'), require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.init, global.registry);
    global.create = mod.exports;
  }
})(this, function (exports, module, _objectAssign, _init, _globalRegistry) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_objectAssign);

  var _init2 = _interopRequireDefault(_init);

  var _registry = _interopRequireDefault(_globalRegistry);

  module.exports = function (name, props) {
    var Ctor = _registry['default'].get(name);
    var elem = Ctor ? Ctor.type.create(Ctor) : document.createElement(name);
    Ctor && Ctor.isNative || (0, _init2['default'])(elem);
    return (0, _assign['default'])(elem, props);
  };
});
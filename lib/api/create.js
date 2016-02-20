(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'object-assign', '../native/create-element', './init', '../shared/registry'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('object-assign'), require('../native/create-element'), require('./init'), require('../shared/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.objectAssign, global.createElement, global.init, global.registry);
    global.create = mod.exports;
  }
})(this, function (module, exports, _objectAssign, _createElement, _init, _registry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, props) {
    var Ctor = _registry2.default.get(name);
    var elem = Ctor ? Ctor.type.create(Ctor) : (0, _createElement2.default)(name);
    Ctor && (0, _init2.default)(elem);
    return (0, _objectAssign2.default)(elem, props);
  };

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _createElement2 = _interopRequireDefault(_createElement);

  var _init2 = _interopRequireDefault(_init);

  var _registry2 = _interopRequireDefault(_registry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'object-assign', './init', '../global/registry'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('object-assign'), require('./init'), require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.objectAssign, global.init, global.registry);
    global.create = mod.exports;
  }
})(this, function (exports, _objectAssign, _init, _registry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, props) {
    var Ctor = _registry2.default.get(name);
    var elem = Ctor ? Ctor.type.create(Ctor) : document.createElement(name);
    Ctor && Ctor.isNative || (0, _init2.default)(elem);
    return (0, _objectAssign2.default)(elem, props);
  };

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _init2 = _interopRequireDefault(_init);

  var _registry2 = _interopRequireDefault(_registry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'object-assign', '../native/custom-elements', '../native/create-element', './init', '../native/support'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('object-assign'), require('../native/custom-elements'), require('../native/create-element'), require('./init'), require('../native/support'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.objectAssign, global.customElements, global.createElement, global.init, global.support);
    global.create = mod.exports;
  }
})(this, function (module, exports, _objectAssign, _customElements, _createElement, _init, _support) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name, props) {
    var elem = undefined;
    var Ctor = _customElements2.default.get(name);

    if (Ctor) {
      if (_support2.default.v1) {
        elem = (0, _createElement2.default)(name, { is: Ctor.extends || null });
      } else if (_support2.default.v0) {
        elem = Ctor.extends ? (0, _createElement2.default)(Ctor.extends, name) : (0, _createElement2.default)(name);
      } else {
        if (Ctor.extends) {
          elem = (0, _createElement2.default)(Ctor.extends);
          elem.setAttribute('is', name);
        } else {
          elem = (0, _createElement2.default)(name);
        }
        (0, _init2.default)(elem);
      }
    } else {
      elem = (0, _createElement2.default)(name);
    }

    return (0, _objectAssign2.default)(elem, props);
  };

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _customElements2 = _interopRequireDefault(_customElements);

  var _createElement2 = _interopRequireDefault(_createElement);

  var _init2 = _interopRequireDefault(_init);

  var _support2 = _interopRequireDefault(_support);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
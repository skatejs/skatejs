(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', 'object-assign'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('object-assign'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.objectAssign);
    global.state = mod.exports;
  }
})(this, function (module, exports, _objectAssign) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem, newState) {
    return typeof newState === 'undefined' ? get(elem) : (0, _objectAssign2.default)(elem, newState);
  };

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function get(elem) {
    var props = elem.constructor.properties;
    var state = {};

    for (var key in props) {
      var val = elem[key];

      if (typeof val !== 'undefined') {
        state[key] = val;
      }
    }

    return state;
  }

  module.exports = exports['default'];
});
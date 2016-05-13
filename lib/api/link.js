(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './state'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./state'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.state);
    global.link = mod.exports;
  }
})(this, function (module, exports, _state3) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem, target) {
    return function (e) {
      var value = getValue(e.target);
      var localTarget = target || e.target.name || 'value';

      if (localTarget.indexOf('.') > -1) {
        var parts = localTarget.split('.');
        var firstPart = parts[0];
        var propName = parts.pop();
        var obj = parts.reduce(function (prev, curr) {
          return prev && prev[curr];
        }, elem);

        obj[propName || e.target.name] = value;
        (0, _state4.default)(elem, _defineProperty({}, firstPart, elem[firstPart]));
      } else {
        (0, _state4.default)(elem, _defineProperty({}, localTarget, value));
      }
    };
  };

  var _state4 = _interopRequireDefault(_state3);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function getValue(elem) {
    var type = elem.type;

    if (type === 'checkbox' || type === 'radio') {
      return elem.checked ? elem.value || true : false;
    }

    return elem.value;
  }

  module.exports = exports['default'];
});
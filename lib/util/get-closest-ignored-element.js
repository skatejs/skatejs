(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './ignored'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./ignored'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ignored);
    global.getClosestIgnoredElement = mod.exports;
  }
})(this, function (exports, _ignored) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (element) {
    var parent = element;
    while (parent instanceof Element) {
      if ((0, _ignored2.default)(parent)) {
        return parent;
      }
      parent = parent.parentNode;
    }
  };

  var _ignored2 = _interopRequireDefault(_ignored);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _window = window;
  var Element = _window.Element;
});
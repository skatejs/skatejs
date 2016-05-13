(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/find-element-in-registry'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/find-element-in-registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.findElementInRegistry);
    global.render = mod.exports;
  }
})(this, function (module, exports, _findElementInRegistry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem) {
    var component = (0, _findElementInRegistry2.default)(elem);
    if (component && component.render) {
      component.render(elem);
    }
  };

  var _findElementInRegistry2 = _interopRequireDefault(_findElementInRegistry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
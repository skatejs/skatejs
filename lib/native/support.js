(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './register-element'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./register-element'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.registerElement);
    global.support = mod.exports;
  }
})(this, function (module, exports, _registerElement) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _registerElement2 = _interopRequireDefault(_registerElement);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var v0 = !!_registerElement2.default;
  var v1 = !!window.customElements;
  var polyfilled = !v0 && !v1;
  exports.default = { v0: v0, v1: v1, polyfilled: polyfilled };
  module.exports = exports['default'];
});
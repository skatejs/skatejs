(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["module", "exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.getOwnPropertyDescriptors = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (obj) {
    return Object.getOwnPropertyNames(obj).reduce(function (prev, curr) {
      prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
      return prev;
    }, {});
  };

  module.exports = exports['default'];
});
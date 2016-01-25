(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.getOwnPropertyDescriptors = mod.exports;
  }
})(this, function (exports) {
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
});
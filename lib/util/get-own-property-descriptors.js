(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.getOwnPropertyDescriptors = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  module.exports = function (obj) {
    return Object.getOwnPropertyNames(obj).reduce(function (prev, curr) {
      prev[curr] = Object.getOwnPropertyDescriptor(obj, curr);
      return prev;
    }, {});
  };
});
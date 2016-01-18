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
    global.protos = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  module.exports = function (proto) {
    var chains = [];
    while (proto) {
      chains.push(proto);
      proto = Object.getPrototypeOf(proto);
    }
    chains.reverse();
    return chains;
  };
});
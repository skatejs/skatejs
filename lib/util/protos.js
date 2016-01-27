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
    global.protos = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (proto) {
    var chains = [];
    while (proto) {
      chains.push(proto);
      proto = Object.getPrototypeOf(proto);
    }
    chains.reverse();
    return chains;
  };

  module.exports = exports['default'];
});
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
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  if (!window.__skate0) {
    window.__skate0 = {
      registerIfNotExists: function registerIfNotExists(name, value) {
        if (!this[name]) {
          this[name] = value;
        }

        return this[name];
      }
    };
  }

  module.exports = window.__skate0;
});
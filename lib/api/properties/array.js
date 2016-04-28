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
    global.array = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    coerce: function coerce(val) {
      return Array.isArray(val) ? val : [val];
    },
    default: function _default() {
      return [];
    },
    deserialize: JSON.parse,
    serialize: JSON.stringify
  };
  module.exports = exports['default'];
});
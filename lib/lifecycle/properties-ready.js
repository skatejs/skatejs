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
    global.propertiesReady = mod.exports;
  }
})(this, function (module, exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = propertiesApply;

  function propertiesApply(elem, properties) {
    Object.keys(properties).forEach(function (name) {
      properties[name].ready(elem);
    });
  }

  module.exports = exports['default'];
});
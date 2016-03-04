(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.vars = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  // This should only be changed / incremented when the internal shared API
  // changes in a backward incompatible way. It's designed to be shared with
  // other Skate versions if it's compatible for performance reasons and also
  // to align with the spec since in native there is a global registry.
  var VERSION = '__skate_0_16_0';

  if (!window[VERSION]) {
    window[VERSION] = {
      registerIfNotExists: function registerIfNotExists(name, value) {
        return this[name] || (this[name] = value);
      }
    };
  }

  exports.default = window[VERSION];
  module.exports = exports['default'];
});
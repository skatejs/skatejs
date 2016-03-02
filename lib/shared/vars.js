(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../api/version'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../api/version'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.version);
    global.vars = mod.exports;
  }
})(this, function (module, exports, _version) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _version2 = _interopRequireDefault(_version);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var VERSION = '__skate_' + _version2.default.replace(/[^\w]/g, '_');

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
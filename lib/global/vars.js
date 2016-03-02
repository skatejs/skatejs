(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../api/version'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../api/version'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.version);
    global.vars = mod.exports;
  }
})(this, function (exports, module, _apiVersion) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _version = _interopRequireDefault(_apiVersion);

  var VERSION = '__skate_' + _version['default'].replace(/[^\w]/g, '_');

  if (!window[VERSION]) {
    window[VERSION] = {
      registerIfNotExists: function registerIfNotExists(name, value) {
        return this[name] || (this[name] = value);
      }
    };
  }

  module.exports = window[VERSION];
});
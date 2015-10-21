(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.attribute = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var noop = function noop() {};

  module.exports = function (opts) {
    var callback = opts.attribute;

    if (typeof callback !== 'function') {
      return noop;
    }

    return function (name, oldValue, newValue) {
      callback(this, {
        name: name,
        newValue: newValue === null ? undefined : newValue,
        oldValue: oldValue === null ? undefined : oldValue
      });
    };
  };
});
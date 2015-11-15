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
    global.string = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  module.exports = {
    coerce: function coerce(value) {
      return typeof value === 'undefined' ? value : String(value);
    },
    deserialize: function deserialize(value) {
      return value === null ? undefined : value;
    },
    serialize: function serialize(value) {
      return typeof value === 'undefined' ? value : String(value);
    }
  };
});
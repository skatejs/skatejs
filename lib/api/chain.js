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
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  module.exports = chain;

  function chain() {
    var _this = this;

    for (var _len = arguments.length, cbs = Array(_len), _key = 0; _key < _len; _key++) {
      cbs[_key] = arguments[_key];
    }

    cbs = cbs.filter(Boolean).map(function (cb) {
      // Strings point to a function on the context passed to the proxy fn.
      if (typeof cb === 'string') {
        return function () {
          if (typeof this[cb] === 'function') {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            this[cb].apply(this, args);
          }
        };
      }

      // Arrays are passed through and object values become an array of values.
      if (typeof cb === 'object') {
        cb = Array.isArray(cb) ? cb : Object.keys(cb).map(function (key) {
          return cb[key];
        });
        return chain.apply(_this, cb);
      }

      return cb;
    });

    return function () {
      var _this2 = this;

      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      cbs.forEach(function (cb) {
        return cb.apply(_this2, args);
      });
      return this;
    };
  }
});
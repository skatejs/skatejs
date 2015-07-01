(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  }
})(function (exports, module) {
  "use strict";

  module.exports = chain;

  function chain() {
    var _this = this;

    for (var _len = arguments.length, cbs = Array(_len), _key = 0; _key < _len; _key++) {
      cbs[_key] = arguments[_key];
    }

    // Optimisation so that it doesn't wrap at all if you've only passed in a
    // single function.
    if (cbs.length === 1 && typeof cbs[0] === "function") {
      return cbs[0];
    }

    cbs = cbs.filter(Boolean).map(function (cb) {
      // Strings point to a function on the context passed to the proxy fn.
      if (typeof cb === "string") {
        return function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          if (typeof this[cb] === "function") {
            this[cb].apply(this, args);
          }
        };
      }

      // Arrays are passed through and object values become an array of values.
      if (typeof cb === "object") {
        cb = Array.isArray(cb) ? cb : Object.keys(cb).map(function (key) {
          return cb[key];
        });
        return chain.apply(_this, cb);
      }

      return cb;
    });

    return function () {
      var _this2 = this;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      cbs.forEach(function (cb) {
        return cb.apply(_this2, args);
      });
      return this;
    };
  }
});
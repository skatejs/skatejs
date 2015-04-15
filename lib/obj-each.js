(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./has-own"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./has-own"));
  }
})(function (exports, module, _hasOwn) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var hasOwn = _interopRequire(_hasOwn);

  module.exports = function (obj, fn) {
    for (var a in obj) {
      if (hasOwn(obj, a)) {
        fn(obj[a], a);
      }
    }
  };
});
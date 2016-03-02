(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./version"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./version"));
  }
})(function (exports, module, _version) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var version = _interopRequire(_version);

  var VERSION = "__skate_" + version.replace(/[^\w]/g, "_");

  if (!window[VERSION]) {
    window[VERSION] = {
      observer: undefined,
      registry: {}
    };
  }

  module.exports = window[VERSION];
});
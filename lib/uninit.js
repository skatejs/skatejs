(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./detached", "../polyfill/registry"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./detached"), require("../polyfill/registry"));
  }
})(function (exports, module, _detached, _polyfillRegistry) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var detached = _interopRequire(_detached);

  var registry = _interopRequire(_polyfillRegistry);

  module.exports = function (element) {
    registry.getForElement(element).forEach(function (options) {
      detached(options).call(element);
    });
  };
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./attached", "./created", "../polyfill/registry"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./attached"), require("./created"), require("../polyfill/registry"));
  }
})(function (exports, module, _attached, _created, _polyfillRegistry) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var attached = _interopRequire(_attached);

  var created = _interopRequire(_created);

  var registry = _interopRequire(_polyfillRegistry);

  function callCallback(element, callback) {
    return function (options) {
      callback(options).call(element);
    };
  }

  module.exports = function (element) {
    var components = registry.getForElement(element);
    components.forEach(callCallback(element, created));
    components.forEach(callCallback(element, attached));
  };
});
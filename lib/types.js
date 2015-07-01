(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./type/element"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./type/element"));
  }
})(function (exports, module, _typeElement) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var typeElement = _interopRequire(_typeElement);

  module.exports = {
    element: typeElement
  };
});
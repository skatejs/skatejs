(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./ignored"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./ignored"));
  }
})(function (exports, module, _ignored) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var ignored = _interopRequire(_ignored);

  var DocumentFragment = window.DocumentFragment;

  module.exports = function (element) {
    var parent = element;

    while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
      if (ignored(parent)) {
        return parent;
      }

      parent = parent.parentNode;
    }
  };
});
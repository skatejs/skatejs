(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../utils/data", "../utils/element-contains"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../utils/data"), require("../utils/element-contains"));
  }
})(function (exports, module, _utilsData, _utilsElementContains) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var data = _interopRequire(_utilsData);

  var elementContains = _interopRequire(_utilsElementContains);

  module.exports = function (options) {
    return function () {
      var element = this;
      var targetData = data(element, options.id);

      if (targetData.detached || elementContains(document, element)) {
        return;
      }

      targetData.detached = true;

      if (options.detached) {
        options.detached(element);
      }

      targetData.attached = false;
    };
  };
});
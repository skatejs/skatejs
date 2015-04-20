(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../lifecycle/init", "../utils/walk-tree"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../lifecycle/init"), require("../utils/walk-tree"));
  }
})(function (exports, module, _lifecycleInit, _utilsWalkTree) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var init = _interopRequire(_lifecycleInit);

  var walkTree = _interopRequire(_utilsWalkTree);

  var HTMLElement = window.HTMLElement;

  module.exports = function (nodes) {
    var nodesToUse = nodes;

    if (!nodes) {
      return nodes;
    }

    if (typeof nodes === "string") {
      nodesToUse = nodes = document.querySelectorAll(nodes);
    } else if (nodes instanceof HTMLElement) {
      nodesToUse = [nodes];
    }

    walkTree(nodesToUse, init);

    return nodes;
  };
});
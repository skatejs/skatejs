(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../lifecycle/attached", "../lifecycle/created", "../util/element-contains", "../global/registry", "../util/walk-tree"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../lifecycle/attached"), require("../lifecycle/created"), require("../util/element-contains"), require("../global/registry"), require("../util/walk-tree"));
  }
})(function (exports, module, _lifecycleAttached, _lifecycleCreated, _utilElementContains, _globalRegistry, _utilWalkTree) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var attached = _interopRequire(_lifecycleAttached);

  var created = _interopRequire(_lifecycleCreated);

  var elementContains = _interopRequire(_utilElementContains);

  var registry = _interopRequire(_globalRegistry);

  var walkTree = _interopRequire(_utilWalkTree);

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

    walkTree(nodesToUse, function (element) {
      var components = registry.find(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        created(components[a]).call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        if (elementContains(document, element)) {
          attached(components[a]).call(element);
        }
      }
    });

    return nodes;
  };
});
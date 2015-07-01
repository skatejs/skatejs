(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../api/watch", "../lifecycle/attached", "../lifecycle/created", "../lifecycle/detached", "./vars", "../util/ignored", "./registry", "../util/walk-tree"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../api/watch"), require("../lifecycle/attached"), require("../lifecycle/created"), require("../lifecycle/detached"), require("./vars"), require("../util/ignored"), require("./registry"), require("../util/walk-tree"));
  }
})(function (exports, module, _apiWatch, _lifecycleAttached, _lifecycleCreated, _lifecycleDetached, _vars, _utilIgnored, _registry, _utilWalkTree) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var apiWatch = _interopRequire(_apiWatch);

  var attached = _interopRequire(_lifecycleAttached);

  var created = _interopRequire(_lifecycleCreated);

  var detached = _interopRequire(_lifecycleDetached);

  var globals = _interopRequire(_vars);

  var ignored = _interopRequire(_utilIgnored);

  var registry = _interopRequire(_registry);

  var walkTree = _interopRequire(_utilWalkTree);

  var DocumentFragment = window.DocumentFragment;

  function getClosestIgnoredElement(element) {
    var parent = element;

    while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
      if (ignored(parent)) {
        return parent;
      }

      parent = parent.parentNode;
    }
  }

  function documentObserverHandler(addedNodes, removedNodes) {
    // Since siblings are batched together, we check the first node's parent
    // node to see if it is ignored. If it is then we don't process any added
    // nodes. This prevents having to check every node.
    if (addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
      walkTree(addedNodes, function (element) {
        var components = registry.find(element);
        var componentsLength = components.length;

        for (var a = 0; a < componentsLength; a++) {
          created(components[a]).call(element);
        }

        for (var a = 0; a < componentsLength; a++) {
          attached(components[a]).call(element);
        }
      });
    }

    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes.length) {
      walkTree(removedNodes, function (element) {
        var components = registry.find(element);
        var componentsLength = components.length;

        for (var a = 0; a < componentsLength; a++) {
          detached(components[a]).call(element);
        }
      });
    }
  }

  module.exports = globals.registerIfNotExists("observer", {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
        this.observer = apiWatch(document, documentObserverHandler, { subtree: true });
      }

      return this;
    },
    unregister: function unregister() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = undefined;
      }

      return this;
    }
  });
});
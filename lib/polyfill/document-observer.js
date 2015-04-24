(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../lifecycle/attached", "../lifecycle/created", "../lifecycle/detached", "../utils/get-closest-ignored-element", "../globals", "./mutation-observer", "./registry", "../utils/walk-tree"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../lifecycle/attached"), require("../lifecycle/created"), require("../lifecycle/detached"), require("../utils/get-closest-ignored-element"), require("../globals"), require("./mutation-observer"), require("./registry"), require("../utils/walk-tree"));
  }
})(function (exports, module, _lifecycleAttached, _lifecycleCreated, _lifecycleDetached, _utilsGetClosestIgnoredElement, _globals, _mutationObserver, _registry, _utilsWalkTree) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var attached = _interopRequire(_lifecycleAttached);

  var created = _interopRequire(_lifecycleCreated);

  var detached = _interopRequire(_lifecycleDetached);

  var getClosestIgnoredElement = _interopRequire(_utilsGetClosestIgnoredElement);

  var globals = _interopRequire(_globals);

  var MutationObserver = _interopRequire(_mutationObserver);

  var registry = _interopRequire(_registry);

  var walkTree = _interopRequire(_utilsWalkTree);

  function documentObserverHandler(mutations) {
    var mutationsLen = mutations.length;

    for (var a = 0; a < mutationsLen; a++) {
      var mutation = mutations[a];
      var addedNodes = mutation.addedNodes;
      var removedNodes = mutation.removedNodes;

      // Since siblings are batched together, we check the first node's parent
      // node to see if it is ignored. If it is then we don't process any added
      // nodes. This prevents having to check every node.
      if (addedNodes && addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
        walkTree(addedNodes, function (element) {
          var components = registry.getForElement(element);
          var componentsLength = components.length;

          for (var _a = 0; _a < componentsLength; _a++) {
            created(components[_a]).call(element);
          }

          for (var _a2 = 0; _a2 < componentsLength; _a2++) {
            attached(components[_a2]).call(element);
          }
        });
      }

      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        walkTree(removedNodes, function (element) {
          var components = registry.getForElement(element);
          var componentsLength = components.length;

          for (var _a = 0; _a < componentsLength; _a++) {
            detached(components[_a]).call(element);
          }
        });
      }
    }
  }

  function createDocumentObserver() {
    var observer = new MutationObserver(documentObserverHandler);

    // Observe after the DOM content has loaded.
    observer.observe(document, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  module.exports = {
    register: function register() {
      if (!globals.observer) {
        MutationObserver.fixIe();
        globals.observer = createDocumentObserver();
      }

      return this;
    },

    unregister: function unregister() {
      if (globals.observer) {
        globals.observer.disconnect();
        globals.observer = undefined;
      }

      return this;
    }
  };
});
(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "../lifecycle/detached", "../utils/get-closest-ignored-element", "../globals", "../lifecycle/init", "../polyfill/mutation-observer", "../lifecycle/uninit", "../utils/walk-tree"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("../lifecycle/detached"), require("../utils/get-closest-ignored-element"), require("../globals"), require("../lifecycle/init"), require("../polyfill/mutation-observer"), require("../lifecycle/uninit"), require("../utils/walk-tree"));
  }
})(function (exports, module, _lifecycleDetached, _utilsGetClosestIgnoredElement, _globals, _lifecycleInit, _polyfillMutationObserver, _lifecycleUninit, _utilsWalkTree) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var detached = _interopRequire(_lifecycleDetached);

  var getClosestIgnoredElement = _interopRequire(_utilsGetClosestIgnoredElement);

  var globals = _interopRequire(_globals);

  var init = _interopRequire(_lifecycleInit);

  var MutationObserver = _interopRequire(_polyfillMutationObserver);

  var uninit = _interopRequire(_lifecycleUninit);

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
        walkTree(addedNodes, init);
      }

      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        walkTree(removedNodes, uninit);
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
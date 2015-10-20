(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./globals", "./lifecycle", "./mutation-observer", "./utils"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./globals"), require("./lifecycle"), require("./mutation-observer"), require("./utils"));
  }
})(function (exports, module, _globals, _lifecycle, _mutationObserver, _utils) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var globals = _interopRequire(_globals);

  var initElements = _lifecycle.initElements;
  var removeElements = _lifecycle.removeElements;
  var getClosestIgnoredElement = _utils.getClosestIgnoredElement;

  /**
   * The document observer handler.
   *
   * @param {Array} mutations The mutations to handle.
   *
   * @returns {undefined}
   */
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
        initElements(addedNodes);
      }

      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        removeElements(removedNodes);
      }
    }
  }

  /**
   * Creates a new mutation observer for listening to Skate definitions for the
   * document.
   *
   * @param {Element} root The element to observe.
   *
   * @returns {MutationObserver}
   */
  function createDocumentObserver() {
    var observer = new window.MutationObserver(documentObserverHandler);

    // Observe after the DOM content has loaded.
    observer.observe(document, {
      childList: true,
      subtree: true
    });

    return observer;
  }

  module.exports = {
    register: function register(fixIe) {
      // IE has issues with reporting removedNodes correctly. See the polyfill for
      // details. If we fix IE, we must also re-define the document observer.
      if (fixIe) {
        this.unregister();
      }

      if (!globals.observer) {
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
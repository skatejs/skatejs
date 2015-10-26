(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  }
})(function (exports) {
  "use strict";

  var isIeUntil10 = /MSIE/.test(navigator.userAgent);
  var isIe11 = /Trident/.test(navigator.userAgent);
  var isIe = isIeUntil10 || isIe11;
  var elementPrototype = window.HTMLElement.prototype;

  // ! This walkTree method differs from the implementation in ../../utils/walk-tree
  // It invokes the callback only for the children, not the passed node and the second parameter to the callback is the parent node
  function walkTree(node, cb) {
    var childNodes = node.childNodes;

    if (!childNodes) {
      return;
    }

    var childNodesLen = childNodes.length;

    for (var a = 0; a < childNodesLen; a++) {
      var childNode = childNodes[a];
      cb(childNode, node);
      walkTree(childNode, cb);
    }
  }

  function fixInnerHTML() {
    var originalInnerHTML = Object.getOwnPropertyDescriptor(elementPrototype, "innerHTML");

    var get = function get() {
      return originalInnerHTML.get.call(this);
    };
    get._hasBeenEnhanced = true;

    // This redefines the innerHTML property so that we can ensure that events
    // are properly triggered.
    Object.defineProperty(elementPrototype, "innerHTML", {
      get: get,
      set: function set(html) {
        walkTree(this, function (node, parentNode) {
          var mutationEvent = document.createEvent("MutationEvent");
          mutationEvent.initMutationEvent("DOMNodeRemoved", true, false, parentNode, null, null, null, null);
          node.dispatchEvent(mutationEvent);
        });
        originalInnerHTML.set.call(this, html);
      }
    });
  }

  if (isIe) {
    // IE 9-11
    var propertyDescriptor = Object.getOwnPropertyDescriptor(elementPrototype, "innerHTML");
    var hasBeenEnhanced = !!propertyDescriptor && propertyDescriptor.get._hasBeenEnhanced;

    if (!hasBeenEnhanced) {
      if (isIe11) {
        // IE11's native MutationObserver needs some help as well :()
        window.MutationObserver = window.JsMutationObserver || window.MutationObserver;
      }

      fixInnerHTML();
    }
  }
});
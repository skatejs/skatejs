'use strict';

import MutationObserver from './mutation-observer';
import {
  initElements,
  removeElements
} from './lifecycle';
import {
  getClosestIgnoredElement
} from './utils';

var handlers = [];

/**
 * The document observer handler.
 *
 * @param {Array} mutations The mutations to handle.
 *
 * @returns {undefined}
 */
function documentObserverHandler (mutations) {
  var mutationsLen = mutations.length;

  for (var a = 0; a < mutationsLen; a++) {
    var mutation = mutations[a];
    var addedNodes = mutation.addedNodes;
    var addedNodesLen = addedNodes && addedNodes.length;
    var removedNodes = mutation.removedNodes;
    var removedNodesLen = removedNodes && removedNodes.length;

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
function createDocumentObserver () {
  var observer = new MutationObserver(documentObserverHandler);

  // Observe after the DOM content has loaded.
  observer.observe(document, {
    childList: true,
    subtree: true
  });

  return observer;
}

export default {
  register: function (fixIe) {
    // IE has issues with reporting removedNodes correctly. See the polyfill for
    // details. If we fix IE, we must also re-define the document observer.
    if (fixIe) {
      MutationObserver.fixIe();
      this.unregister();
    }

    if (!window.__skateDocumentObserver) {
      window.__skateDocumentObserver = createDocumentObserver();
    }

    return this;
  },

  unregister: function () {
    if (window.__skateDocumentObserver) {
      window.__skateDocumentObserver.disconnect();
      window.__skateDocumentObserver = undefined;
    }

    return this;
  }
};

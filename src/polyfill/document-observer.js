import detached from '../lifecycle/detached';
import getClosestIgnoredElement from '../utils/get-closest-ignored-element';
import globals from '../globals';
import init from '../lifecycle/init';
import MutationObserver from '../polyfill/mutation-observer';
import uninit from '../lifecycle/uninit';
import walkTree from '../utils/walk-tree';

function documentObserverHandler (mutations) {
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
  register: function () {
    if (!globals.observer) {
      MutationObserver.fixIe();
      globals.observer = createDocumentObserver();
    }

    return this;
  },

  unregister: function () {
    if (globals.observer) {
      globals.observer.disconnect();
      globals.observer = undefined;
    }

    return this;
  }
};

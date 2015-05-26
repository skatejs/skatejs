import attached from '../lifecycle/attached';
import created from '../lifecycle/created';
import detached from '../lifecycle/detached';
import getClosestIgnoredElement from '../util/get-closest-ignored-element';
import globals from '../globals';
import MutationObserver from './mutation-observer';
import registry from './registry';
import walkTree from '../util/walk-tree';

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
      walkTree(addedNodes, function (element) {
        var components = registry.getForElement(element);
        var componentsLength = components.length;

        for (let a = 0; a < componentsLength; a++) {
          created(components[a]).call(element);
        }

        for (let a = 0; a < componentsLength; a++) {
          attached(components[a]).call(element);
        }
      });
    }

    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes && removedNodes.length) {
      walkTree(removedNodes, function (element) {
        var components = registry.getForElement(element);
        var componentsLength = components.length;

        for (let a = 0; a < componentsLength; a++) {
          detached(components[a]).call(element);
        }
      });
    }
  }
}

function createDocumentObserver () {
  var observer = new MutationObserver(documentObserverHandler);

  observer.observe(document, {
    childList: true,
    subtree: true
  });

  return observer;
}

export default globals.registerIfNotExists('observer', {
  observer: undefined,
  register: function () {
    if (!this.observer) {
      MutationObserver.fixIe();
      this.observer = createDocumentObserver();
    }

    return this;
  },
  unregister: function () {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    return this;
  }
});

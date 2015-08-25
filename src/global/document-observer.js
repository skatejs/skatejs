import attached from '../lifecycle/attached';
import created from '../lifecycle/created';
import detached from '../lifecycle/detached';
import globals from './vars';
import ignored from '../util/ignored';
import registry from './registry';
import walkTree from '../util/walk-tree';

var DocumentFragment = window.DocumentFragment;
var MutationObserver = window.MutationObserver || window.SkateMutationObserver;

function getClosestIgnoredElement (element) {
  var parent = element;
  while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
    if (ignored(parent)) {
      return parent;
    }
    parent = parent.parentNode;
  }
}

function triggerAddedNodes (addedNodes) {
  walkTree(addedNodes, function (element) {
    var components = registry.find(element);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      created(components[a]).call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      attached(components[a]).call(element);
    }
  });
}

function triggerRemovedNodes (removedNodes) {
  walkTree(removedNodes, function (element) {
    var components = registry.find(element);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      detached(components[a]).call(element);
    }
  });
}

function documentObserverHandler (mutations) {
  var mutationsLength = mutations.length;

  for (let a = 0; a < mutationsLength; a++) {
    var addedNodes = mutations[a].addedNodes;
    var removedNodes = mutations[a].removedNodes;

    // Since siblings are batched together, we check the first node's parent
    // node to see if it is ignored. If it is then we don't process any added
    // nodes. This prevents having to check every node.
    if (addedNodes && addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
      triggerAddedNodes(addedNodes);
    }

    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes && removedNodes.length) {
      triggerRemovedNodes(removedNodes);
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

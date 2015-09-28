import globals from './vars';
import getClosestIgnoredElement from '../util/get-closest-ignored-element';
import registry from './registry';
import walkTree from '../util/walk-tree';
import warn from '../util/warn';

var MutationObserver = window.MutationObserver || window.SkateMutationObserver;

function triggerAddedNodes (addedNodes) {
  walkTree(addedNodes, function (element) {
    var components = registry.find(element);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.createdCallback.call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.attachedCallback.call(element);
    }
  });
}

function triggerRemovedNodes (removedNodes) {
  walkTree(removedNodes, function (element) {
    var components = registry.find(element);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.detachedCallback.call(element);
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
  if (!MutationObserver) {
    warn('Your browser does not support native custom elements or mutation observers. In order for Skate to automatically initialise components you must at the very least have a mutation observer polyfill loaded.\n\n- http://w3c.github.io/webcomponents/spec/custom/\n- https://developer.mozilla.org/en/docs/Web/API/MutationObserver\n- https://github.com/skatejs/polyfill-mutation-observer');
    return;
  }
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

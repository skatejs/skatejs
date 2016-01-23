import '../fix/ie/innerhtml';
import globals from './vars';
import registry from './registry';
import walkTree from '../util/walk-tree';

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
    if (addedNodes && addedNodes.length) {
      triggerAddedNodes(addedNodes);
    }

    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes && removedNodes.length) {
      triggerRemovedNodes(removedNodes);
    }
  }
}

function createMutationObserver () {
  const { MutationObserver } = window;
  if (!MutationObserver) {
    throw new Error('Mutation Observers are not supported by this browser. Skate requires them in order to polyfill the behaviour of Custom Elements. If you want to support this browser you should include a Mutation Observer polyfill before Skate.');
  }
  return new MutationObserver(documentObserverHandler);
}

function createDocumentObserver () {
  var observer = createMutationObserver();
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

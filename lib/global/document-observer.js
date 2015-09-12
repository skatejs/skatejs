(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../lifecycle/attached', '../lifecycle/created', '../lifecycle/detached', './vars', '../util/get-closest-ignored-element', './registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../lifecycle/attached'), require('../lifecycle/created'), require('../lifecycle/detached'), require('./vars'), require('../util/get-closest-ignored-element'), require('./registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.attached, global.created, global.detached, global.globals, global.getClosestIgnoredElement, global.registry, global.walkTree);
    global.documentObserver = mod.exports;
  }
})(this, function (exports, module, _lifecycleAttached, _lifecycleCreated, _lifecycleDetached, _vars, _utilGetClosestIgnoredElement, _registry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _detached = _interopRequireDefault(_lifecycleDetached);

  var _globals = _interopRequireDefault(_vars);

  var _getClosestIgnoredElement = _interopRequireDefault(_utilGetClosestIgnoredElement);

  var _registry2 = _interopRequireDefault(_registry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var MutationObserver = window.MutationObserver || window.SkateMutationObserver;

  function triggerAddedNodes(addedNodes) {
    (0, _walkTree['default'])(addedNodes, function (element) {
      var components = _registry2['default'].find(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        (0, _created['default'])(components[a]).call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        (0, _attached['default'])(components[a]).call(element);
      }
    });
  }

  function triggerRemovedNodes(removedNodes) {
    (0, _walkTree['default'])(removedNodes, function (element) {
      var components = _registry2['default'].find(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        (0, _detached['default'])(components[a]).call(element);
      }
    });
  }

  function documentObserverHandler(mutations) {
    var mutationsLength = mutations.length;

    for (var a = 0; a < mutationsLength; a++) {
      var addedNodes = mutations[a].addedNodes;
      var removedNodes = mutations[a].removedNodes;

      // Since siblings are batched together, we check the first node's parent
      // node to see if it is ignored. If it is then we don't process any added
      // nodes. This prevents having to check every node.
      if (addedNodes && addedNodes.length && !(0, _getClosestIgnoredElement['default'])(addedNodes[0].parentNode)) {
        triggerAddedNodes(addedNodes);
      }

      // We can't check batched nodes here because they won't have a parent node.
      if (removedNodes && removedNodes.length) {
        triggerRemovedNodes(removedNodes);
      }
    }
  }

  function createDocumentObserver() {
    var observer = new MutationObserver(documentObserverHandler);
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    return observer;
  }

  module.exports = _globals['default'].registerIfNotExists('observer', {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
        this.observer = createDocumentObserver();
      }
      return this;
    },
    unregister: function unregister() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = undefined;
      }
      return this;
    }
  });
});
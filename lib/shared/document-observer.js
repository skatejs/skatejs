(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/get-closest-ignored-element', './vars', './registry', '../util/walk-tree', '../fix/ie/innerhtml'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/get-closest-ignored-element'), require('./vars'), require('./registry'), require('../util/walk-tree'), require('../fix/ie/innerhtml'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.getClosestIgnoredElement, global.vars, global.registry, global.walkTree, global.innerhtml);
    global.documentObserver = mod.exports;
  }
})(this, function (module, exports, _getClosestIgnoredElement, _vars, _registry, _walkTree) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _getClosestIgnoredElement2 = _interopRequireDefault(_getClosestIgnoredElement);

  var _vars2 = _interopRequireDefault(_vars);

  var _registry2 = _interopRequireDefault(_registry);

  var _walkTree2 = _interopRequireDefault(_walkTree);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function triggerAddedNodes(addedNodes) {
    (0, _walkTree2.default)(addedNodes, function (element) {
      var components = _registry2.default.find(element);

      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.attachedCallback.call(element);
      }
    });
  }

  function triggerRemovedNodes(removedNodes) {
    (0, _walkTree2.default)(removedNodes, function (element) {
      var components = _registry2.default.find(element);

      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        components[a].prototype.detachedCallback.call(element);
      }
    });
  }

  function documentObserverHandler(mutations) {
    var mutationsLength = mutations.length;

    for (var a = 0; a < mutationsLength; a++) {
      var addedNodes = mutations[a].addedNodes;
      var removedNodes = mutations[a].removedNodes;

      if (addedNodes && addedNodes.length && !(0, _getClosestIgnoredElement2.default)(addedNodes[0].parentNode)) {
        triggerAddedNodes(addedNodes);
      }

      if (removedNodes && removedNodes.length) {
        triggerRemovedNodes(removedNodes);
      }
    }
  }

  function createMutationObserver() {
    var _window = window;
    var MutationObserver = _window.MutationObserver;

    if (!MutationObserver) {
      throw new Error('Mutation Observers are not supported by this browser. Skate requires them in order to polyfill the behaviour of Custom Elements. If you want to support this browser you should include a Mutation Observer polyfill before Skate.');
    }

    return new MutationObserver(documentObserverHandler);
  }

  function createDocumentObserver() {
    var observer = createMutationObserver();
    observer.observe(document, {
      childList: true,
      subtree: true
    });
    return observer;
  }

  exports.default = _vars2.default.registerIfNotExists('observer', {
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
  module.exports = exports['default'];
});
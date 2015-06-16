(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../api/watch', '../lifecycle/attached', '../lifecycle/created', '../lifecycle/detached', '../globals', '../util/ignored', './registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../api/watch'), require('../lifecycle/attached'), require('../lifecycle/created'), require('../lifecycle/detached'), require('../globals'), require('../util/ignored'), require('./registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.apiWatch, global.attached, global.created, global.detached, global.globals, global.ignored, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _apiWatch, _lifecycleAttached, _lifecycleCreated, _lifecycleDetached, _globals, _utilIgnored, _registry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _apiWatch2 = _interopRequireDefault(_apiWatch);

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _detached = _interopRequireDefault(_lifecycleDetached);

  var _globals2 = _interopRequireDefault(_globals);

  var _ignored = _interopRequireDefault(_utilIgnored);

  var _registry2 = _interopRequireDefault(_registry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var DocumentFragment = window.DocumentFragment;

  function getClosestIgnoredElement(element) {
    var parent = element;

    while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
      if ((0, _ignored['default'])(parent)) {
        return parent;
      }

      parent = parent.parentNode;
    }
  }

  function documentObserverHandler(addedNodes, removedNodes) {
    // Since siblings are batched together, we check the first node's parent
    // node to see if it is ignored. If it is then we don't process any added
    // nodes. This prevents having to check every node.
    if (addedNodes.length && !getClosestIgnoredElement(addedNodes[0].parentNode)) {
      (0, _walkTree['default'])(addedNodes, function (element) {
        var components = _registry2['default'].getForElement(element);
        var componentsLength = components.length;

        for (var a = 0; a < componentsLength; a++) {
          (0, _created['default'])(components[a]).call(element);
        }

        for (var a = 0; a < componentsLength; a++) {
          (0, _attached['default'])(components[a]).call(element);
        }
      });
    }

    // We can't check batched nodes here because they won't have a parent node.
    if (removedNodes.length) {
      (0, _walkTree['default'])(removedNodes, function (element) {
        var components = _registry2['default'].getForElement(element);
        var componentsLength = components.length;

        for (var a = 0; a < componentsLength; a++) {
          (0, _detached['default'])(components[a]).call(element);
        }
      });
    }
  }

  module.exports = _globals2['default'].registerIfNotExists('observer', {
    observer: undefined,
    register: function register() {
      if (!this.observer) {
        this.observer = (0, _apiWatch2['default'])(document, documentObserverHandler, { subtree: true });
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
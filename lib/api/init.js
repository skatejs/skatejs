(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../lifecycle/attached', '../lifecycle/created', '../util/element-contains', '../polyfill/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../lifecycle/attached'), require('../lifecycle/created'), require('../util/element-contains'), require('../polyfill/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.attached, global.created, global.elementContains, global.registry, global.walkTree);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _lifecycleAttached, _lifecycleCreated, _utilElementContains, _polyfillRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _elementContains = _interopRequireDefault(_utilElementContains);

  var _registry = _interopRequireDefault(_polyfillRegistry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  var HTMLElement = window.HTMLElement;

  module.exports = function (nodes) {
    var nodesToUse = nodes;

    if (!nodes) {
      return nodes;
    }

    if (typeof nodes === 'string') {
      nodesToUse = nodes = document.querySelectorAll(nodes);
    } else if (nodes instanceof HTMLElement) {
      nodesToUse = [nodes];
    }

    (0, _walkTree['default'])(nodesToUse, function (element) {
      var components = _registry['default'].getForElement(element);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        (0, _created['default'])(components[a]).call(element);
      }

      for (var a = 0; a < componentsLength; a++) {
        if ((0, _elementContains['default'])(document, element)) {
          (0, _attached['default'])(components[a]).call(element);
        }
      }
    });

    return nodes;
  };
});
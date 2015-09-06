(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../lifecycle/attached', '../lifecycle/created', '../util/element-contains', '../global/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../lifecycle/attached'), require('../lifecycle/created'), require('../util/element-contains'), require('../global/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.attached, global.created, global.elementContains, global.registry, global.walkTree);
    global.init = mod.exports;
  }
})(this, function (exports, module, _lifecycleAttached, _lifecycleCreated, _utilElementContains, _globalRegistry, _utilWalkTree) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _attached = _interopRequireDefault(_lifecycleAttached);

  var _created = _interopRequireDefault(_lifecycleCreated);

  var _elementContains = _interopRequireDefault(_utilElementContains);

  var _registry = _interopRequireDefault(_globalRegistry);

  var _walkTree = _interopRequireDefault(_utilWalkTree);

  module.exports = function (element) {
    var isInDom = (0, _elementContains['default'])(document, element);

    (0, _walkTree['default'])(element, function (descendant) {
      var components = _registry['default'].find(descendant);
      var componentsLength = components.length;

      for (var a = 0; a < componentsLength; a++) {
        (0, _created['default'])(components[a]).call(descendant);
      }

      for (var a = 0; a < componentsLength; a++) {
        if (isInDom) {
          (0, _attached['default'])(components[a]).call(descendant);
        }
      }
    });

    return element;
  };
});
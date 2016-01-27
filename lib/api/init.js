(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/element-contains', '../shared/registry', '../util/walk-tree'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/element-contains'), require('../shared/registry'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.elementContains, global.registry, global.walkTree);
    global.init = mod.exports;
  }
})(this, function (module, exports, _elementContains, _registry, _walkTree) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.forEach(function (arg) {
      var isInDom = (0, _elementContains2.default)(document, arg);
      (0, _walkTree2.default)(arg, function (descendant) {
        var components = _registry2.default.find(descendant);
        var componentsLength = components.length;

        for (var a = 0; a < componentsLength; a++) {
          components[a].prototype.createdCallback.call(descendant);
        }

        for (var a = 0; a < componentsLength; a++) {
          if (isInDom) {
            components[a].prototype.attachedCallback.call(descendant);
          }
        }
      });
    });
  };

  var _elementContains2 = _interopRequireDefault(_elementContains);

  var _registry2 = _interopRequireDefault(_registry);

  var _walkTree2 = _interopRequireDefault(_walkTree);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
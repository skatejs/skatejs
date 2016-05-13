(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/element-contains', '../util/find-element-in-registry', '../native/support', '../util/walk-tree'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/element-contains'), require('../util/find-element-in-registry'), require('../native/support'), require('../util/walk-tree'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.elementContains, global.findElementInRegistry, global.support, global.walkTree);
    global.init = mod.exports;
  }
})(this, function (module, exports, _elementContains, _findElementInRegistry, _support, _walkTree) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function () {
    if (!_support2.default.polyfilled) {
      return;
    }

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    args.forEach(function (arg) {
      var isInDom = (0, _elementContains2.default)(document, arg);

      (0, _walkTree2.default)(arg, function (descendant) {
        var component = (0, _findElementInRegistry2.default)(descendant);

        if (component) {
          if (component.prototype.createdCallback) {
            component.prototype.createdCallback.call(descendant);
          }

          if (isInDom && component.prototype.attachedCallback) {
            isInDom && component.prototype.attachedCallback.call(descendant);
          }
        }
      });
    });
  };

  var _elementContains2 = _interopRequireDefault(_elementContains);

  var _findElementInRegistry2 = _interopRequireDefault(_findElementInRegistry);

  var _support2 = _interopRequireDefault(_support);

  var _walkTree2 = _interopRequireDefault(_walkTree);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../shared/registry'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../shared/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.registry);
    global.render = mod.exports;
  }
})(this, function (module, exports, _registry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem) {
    var component = _registry2.default.find(elem);
    if (component && component.render) {
      component.render(elem);
    }
  };

  var _registry2 = _interopRequireDefault(_registry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
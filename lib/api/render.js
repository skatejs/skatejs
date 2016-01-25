(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../global/registry'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../global/registry'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.registry);
    global.render = mod.exports;
  }
})(this, function (exports, _registry) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (elem) {
    _registry2.default.find(elem).forEach(function (component) {
      return component.render && component.render(elem);
    });
  };

  var _registry2 = _interopRequireDefault(_registry);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});
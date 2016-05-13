(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './skate'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./skate'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.skate);
    global.factory = mod.exports;
  }
})(this, function (module, exports, _skate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    return function (name) {
      return (0, _skate2.default)(name, opts);
    };
  };

  var _skate2 = _interopRequireDefault(_skate);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/protos', '../util/define-properties', '../util/get-own-property-descriptors'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/protos'), require('../util/define-properties'), require('../util/get-own-property-descriptors'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.protos, global.defineProperties, global.getOwnPropertyDescriptors);
    global.prototype = mod.exports;
  }
})(this, function (module, exports, _protos, _defineProperties, _getOwnPropertyDescriptors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = prototype;

  var _protos2 = _interopRequireDefault(_protos);

  var _defineProperties2 = _interopRequireDefault(_defineProperties);

  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function prototype(opts) {
    var prototypes = (0, _protos2.default)(opts.prototype);
    return function (elem) {
      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(elem)) {
          (0, _defineProperties2.default)(elem, (0, _getOwnPropertyDescriptors2.default)(proto));
        }
      });
    };
  }
  module.exports = exports['default'];
});
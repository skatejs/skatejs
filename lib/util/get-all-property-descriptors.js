(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', './get-own-property-descriptors', './protos'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('./get-own-property-descriptors'), require('./protos'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.getOwnPropertyDescriptors, global.protos);
    global.getAllPropertyDescriptors = mod.exports;
  }
})(this, function (module, exports, _getOwnPropertyDescriptors, _protos) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (obj) {
    return (0, _protos2.default)(obj).reduce(function (result, proto) {
      var descriptors = (0, _getOwnPropertyDescriptors2.default)(proto);
      Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
        result[name] = descriptors[name];
        return result;
      }, result);
      return result;
    }, {});
  };

  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

  var _protos2 = _interopRequireDefault(_protos);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
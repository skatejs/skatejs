(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './get-own-property-descriptors', './protos'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./get-own-property-descriptors'), require('./protos'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.getOwnPropertyDescriptors, global.protos);
    global.getAllPropertyDescriptors = mod.exports;
  }
})(this, function (exports, module, _getOwnPropertyDescriptors, _protos) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _getOwnPropertyDescriptors2 = _interopRequireDefault(_getOwnPropertyDescriptors);

  var _protos2 = _interopRequireDefault(_protos);

  module.exports = function (obj) {
    return (0, _protos2['default'])(obj).reduce(function (result, proto) {
      var descriptors = (0, _getOwnPropertyDescriptors2['default'])(proto);
      Object.getOwnPropertyNames(descriptors).reduce(function (result, name) {
        result[name] = descriptors[name];
        return result;
      }, result);
      return result;
    }, {});
  };
});
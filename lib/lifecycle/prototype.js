(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/protos', '../util/define-properties', '../util/get-own-property-descriptors'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/protos'), require('../util/define-properties'), require('../util/get-own-property-descriptors'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.protos, global.utilDefineProperties, global.utilGetOwnPropertyDescriptors);
    global.prototype = mod.exports;
  }
})(this, function (exports, module, _utilProtos, _utilDefineProperties, _utilGetOwnPropertyDescriptors) {
  'use strict';

  module.exports = prototype;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _protos = _interopRequireDefault(_utilProtos);

  var _utilDefineProperties2 = _interopRequireDefault(_utilDefineProperties);

  var _utilGetOwnPropertyDescriptors2 = _interopRequireDefault(_utilGetOwnPropertyDescriptors);

  function prototype(opts) {
    var prototypes = (0, _protos['default'])(opts.prototype);
    return function (elem) {
      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(elem)) {
          (0, _utilDefineProperties2['default'])(elem, (0, _utilGetOwnPropertyDescriptors2['default'])(proto));
        }
      });
    };
  }
});
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/assign-safe', '../util/protos'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/assign-safe'), require('../util/protos'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assignSafe, global.protos);
    global.prototype = mod.exports;
  }
})(this, function (exports, module, _utilAssignSafe, _utilProtos) {
  'use strict';

  module.exports = prototype;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assignSafe = _interopRequireDefault(_utilAssignSafe);

  var _protos = _interopRequireDefault(_utilProtos);

  function prototype(opts) {
    var prototypes = (0, _protos['default'])(opts.prototype);
    return function (elem) {
      prototypes.forEach(function (proto) {
        if (!proto.isPrototypeOf(elem)) {
          (0, _assignSafe['default'])(elem, proto);
        }
      });
    };
  }
});
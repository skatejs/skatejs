(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../util/data'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.data);
    global.attached = mod.exports;
  }
})(this, function (exports, module, _utilData) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _data = _interopRequireDefault(_utilData);

  module.exports = function (opts) {
    return function () {
      var info = (0, _data['default'])(this, 'lifecycle/' + opts.id);
      if (info.attached) return;
      info.attached = true;
      info.detached = false;
      opts.attached(this);
    };
  };
});
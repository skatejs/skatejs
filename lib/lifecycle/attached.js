(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports', '../util/data'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports, require('../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports, global.data);
    global.attached = mod.exports;
  }
})(this, function (module, exports, _data) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    var attached = opts.attached;

    return attached ? function () {
      var info = (0, _data2.default)(this);
      if (info.attached) return;
      info.attached = true;
      info.detached = false;
      attached(this);
    } : undefined;
  };

  var _data2 = _interopRequireDefault(_data);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  module.exports = exports['default'];
});
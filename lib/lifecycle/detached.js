(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', '../util/data'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('../util/data'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.data);
    global.detached = mod.exports;
  }
})(this, function (exports, _data) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    return function () {
      var info = (0, _data2.default)(this, 'lifecycle/' + opts.id);
      if (info.detached) return;
      info.detached = true;
      info.attached = false;
      opts.detached(this);
    };
  };

  var _data2 = _interopRequireDefault(_data);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }
});
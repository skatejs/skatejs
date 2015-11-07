(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== 'undefined') {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { 'default': obj };
  }

  var _boolean = require('./boolean');

  var _boolean2 = _interopRequireDefault(_boolean);

  var _number = require('./number');

  var _number2 = _interopRequireDefault(_number);

  var _string = require('./string');

  var _string2 = _interopRequireDefault(_string);

  exports['default'] = {
    boolean: _boolean2['default'],
    number: _number2['default'],
    string: _string2['default']
  };
  module.exports = exports['default'];
});
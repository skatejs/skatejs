(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', './boolean', './number', './string'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('./boolean'), require('./number'), require('./string'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.boolean, global.number, global.string);
    global.index = mod.exports;
  }
})(this, function (exports, module, _boolean, _number, _string) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _boolean2 = _interopRequireDefault(_boolean);

  var _number2 = _interopRequireDefault(_number);

  var _string2 = _interopRequireDefault(_string);

  module.exports = {
    boolean: _boolean2['default'],
    number: _number2['default'],
    string: _string2['default']
  };
});
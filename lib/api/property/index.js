(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../../util/assign', '../../lifecycle/property', './boolean', './float', './number', './string'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../../util/assign'), require('../../lifecycle/property'), require('./boolean'), require('./float'), require('./number'), require('./string'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.assign, global.property, global.propertyBoolean, global.propertyFloat, global.propertyNumber, global.propertyString);
    global.index = mod.exports;
  }
})(this, function (exports, module, _utilAssign, _lifecycleProperty, _boolean, _float, _number, _string) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _assign = _interopRequireDefault(_utilAssign);

  var _property = _interopRequireDefault(_lifecycleProperty);

  var _propertyBoolean = _interopRequireDefault(_boolean);

  var _propertyFloat = _interopRequireDefault(_float);

  var _propertyNumber = _interopRequireDefault(_number);

  var _propertyString = _interopRequireDefault(_string);

  function prop(type) {
    return function (opts) {
      return (0, _property['default'])((0, _assign['default'])({
        attribute: true
      }, type, opts));
    };
  }

  module.exports = {
    boolean: prop(_propertyBoolean['default']),
    float: prop(_propertyFloat['default']),
    number: prop(_propertyNumber['default']),
    string: prop(_propertyString['default'])
  };
});
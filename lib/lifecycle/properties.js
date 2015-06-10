(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../constants', '../util/dash-case', '../util/data', './notify', './property'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../constants'), require('../util/dash-case'), require('../util/data'), require('./notify'), require('./property'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants, global.dashCase, global.data, global.notify, global.property);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants, _utilDashCase, _utilData, _notify, _property) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _dashCase = _interopRequireDefault(_utilDashCase);

  var _data = _interopRequireDefault(_utilData);

  var _notify2 = _interopRequireDefault(_notify);

  var _property2 = _interopRequireDefault(_property);

  module.exports = function (elem) {
    var props = arguments[1] === undefined ? {} : arguments[1];

    var attributeToPropertyMap = (0, _data['default'])(elem).attributeToPropertyMap = {};

    Object.keys(props).forEach(function (name) {
      var prop = props[name];

      if (!prop) {
        return;
      }

      Object.defineProperty(elem, name, (0, _property2['default'])(name, prop));

      if (prop.attr) {
        attributeToPropertyMap[(0, _dashCase['default'])(name)] = name;
      }

      if (typeof prop.value === 'function') {
        elem[name] = prop.value();
      } else if (typeof prop.value !== 'undefined') {
        elem[name] = prop.value;
      }

      (prop.deps || []).forEach(function (dependency) {
        return elem.addEventListener('' + _constants.EVENT_PREFIX + '' + dependency, _notify2['default'].bind(null, elem, name));
      });
    });
  };
});
(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'object-assign', './boolean', './number', './string'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('object-assign'), require('./boolean'), require('./number'), require('./string'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.objectAssign, global.boolean, global.number, global.string);
    global.index = mod.exports;
  }
})(this, function (exports, _objectAssign, _boolean, _number, _string) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _objectAssign2 = _interopRequireDefault(_objectAssign);

  var _boolean2 = _interopRequireDefault(_boolean);

  var _number2 = _interopRequireDefault(_number);

  var _string2 = _interopRequireDefault(_string);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function prop(def) {
    return function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.unshift({}, def);
      return _objectAssign2.default.apply(null, args);
    };
  }

  exports.default = {
    boolean: prop(_boolean2.default),
    number: prop(_number2.default),
    string: prop(_string2.default)
  };
});
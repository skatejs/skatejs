(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.defineProperties = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (obj, props) {
    Object.keys(props).forEach(function (name) {
      var prop = props[name];
      var descrptor = Object.getOwnPropertyDescriptor(obj, name);
      var isDinosaurBrowser = name !== 'arguments' && name !== 'caller' && 'value' in prop;
      var isConfigurable = !descrptor || descrptor.configurable;

      if (isConfigurable) {
        Object.defineProperty(obj, name, prop);
      } else if (isDinosaurBrowser) {
        obj[name] = prop.value;
      }
    });
  };

  module.exports = exports['default'];
});
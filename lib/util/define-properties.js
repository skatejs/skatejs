(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.defineProperties = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  module.exports = function (obj, props) {
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
});
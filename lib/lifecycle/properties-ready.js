(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.propertiesReady = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  module.exports = propertiesApply;

  function propertiesApply(elem, properties) {
    Object.keys(properties).forEach(function (name) {
      var prop = properties[name];
      prop.set && prop.set.call(elem, elem[name]);
    });
  }
});
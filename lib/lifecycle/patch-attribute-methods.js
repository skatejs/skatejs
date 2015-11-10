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
    global.patchAttributeMethods = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  module.exports = patchAttributeMethods;

  function patchAttributeMethods(elem) {
    var removeAttribute = elem.removeAttribute;
    var setAttribute = elem.setAttribute;

    elem.removeAttribute = function (name) {
      var oldValue = this.getAttribute(name);
      removeAttribute.call(elem, name);
      elem.attributeChangedCallback(name, oldValue, null);
    };

    elem.setAttribute = function (name, newValue) {
      var oldValue = this.getAttribute(name);
      setAttribute.call(elem, name, newValue);
      elem.attributeChangedCallback(name, oldValue, String(newValue));
    };
  }
});
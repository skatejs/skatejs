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
    global.elementConstructor = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  module.exports = function (opts) {
    var type = opts.type;

    function CustomElement() {
      var element = type.create(opts);

      // Ensure the definition prototype is up to date with the element's
      // prototype. This ensures that overwriting the element prototype still
      // works.
      opts.prototype = CustomElement.prototype;

      // Initialises. This will always exist.
      opts.prototype.createdCallback.call(element);

      return element;
    }

    // This allows modifications to the element prototype propagate to the
    // definition prototype.
    CustomElement.prototype = opts.prototype;

    // Ensure the prototype has a non-enumerable constructor.
    Object.defineProperty(CustomElement.prototype, 'constructor', {
      enumerable: false,
      value: CustomElement
    });

    return CustomElement;
  };
});
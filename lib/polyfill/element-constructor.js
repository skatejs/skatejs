(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../constants'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../constants'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants) {
  'use strict';

  var DEFAULT_ELEMENT = 'div';

  function createElement(options) {
    var element;
    var id = options.id;
    var parent = options['extends'];
    var type = options.type;

    // Allow all types of components to be constructed.
    if (type === _constants.TYPE_ELEMENT) {
      element = document.createElement(parent || id);
      if (parent) {
        element.setAttribute('is', id);
      }
    } else {
      element = document.createElement(parent || DEFAULT_ELEMENT);

      if (type === _constants.TYPE_ATTRIBUTE) {
        element.setAttribute(id, '');
      } else if (type === _constants.TYPE_CLASSNAME) {
        element.className = id;
      }
    }

    return element;
  }

  module.exports = function (options) {
    function CustomElement() {
      var element = createElement(options);

      // Ensure the definition prototype is up to date with the element's
      // prototype. This ensures that overwriting the element prototype still
      // works.
      options.prototype = CustomElement.prototype;

      // Initialises. This will always exist.
      options.prototype.createdCallback.call(element);

      return element;
    }

    // This allows modifications to the element prototype propagate to the
    // definition prototype.
    CustomElement.prototype = options.prototype;

    return CustomElement;
  };
});
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
    global.element = mod.exports;
  }
})(this, function (module, exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var documentCreateElement = document.createElement.bind(document);
  var reservedNames = ['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph'];
  var customElementCriteria = ['contain at least one dash', 'not start with a dash', 'not be one of: ' + reservedNames.join(', ')];
  exports.default = {
    create: function create(Ctor) {
      var elem = Ctor.extends ? documentCreateElement(Ctor.extends, Ctor.id) : documentCreateElement(Ctor.id);
      if (!Ctor.isNative && Ctor.extends) {
        elem.setAttribute('is', Ctor.id);
      }
      return elem;
    },
    filter: function filter(elem, defs) {
      var attrs = elem.attributes;
      var isAttr = attrs.is;
      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
      var tagName = (elem.tagName || elem.localName).toLowerCase();
      var definition = defs[isAttrValue || tagName];

      if (!definition) {
        return;
      }

      var tagToExtend = definition.extends;
      if (isAttrValue) {
        if (tagName === tagToExtend) {
          return [definition];
        }
      } else if (!tagToExtend) {
        return [definition];
      }
    },
    register: function register(Ctor) {
      var name = Ctor.id;

      // Screen non-native names and try and be more helpful than native.
      if (name.indexOf('-') < 1 || reservedNames.indexOf(name) > -1) {
        throw new Error(name + ' is not a valid custom element name. A custom element name must: ' + customElementCriteria.map(function (a) {
          return '\n- ' + a;
        }).join(''));
      }

      // In native, we have to massage the definition so that the browser doesn't
      // spit out errors for a malformed definition.
      if (Ctor.isNative) {
        var nativeDefinition = { prototype: Ctor.prototype };
        Ctor.extends && (nativeDefinition.extends = Ctor.extends);
        document.registerElement(name, nativeDefinition);
      }
    }
  };
  module.exports = exports['default'];
});
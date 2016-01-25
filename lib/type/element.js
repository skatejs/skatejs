(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.element = mod.exports;
  }
})(this, function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var documentCreateElement = document.createElement.bind(document);
  exports.default = {
    create: function create(Ctor) {
      var elem = Ctor.extends ? documentCreateElement(Ctor.extends, Ctor.id) : documentCreateElement(Ctor.id);
      !Ctor.isNative && Ctor.extends && elem.setAttribute('is', Ctor.id);
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
    }
  };
});
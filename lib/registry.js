(function (factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module", "./constants", "./globals", "./utils"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module, require("./constants"), require("./globals"), require("./utils"));
  }
})(function (exports, module, _constants, _globals, _utils) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var TYPE_ATTRIBUTE = _constants.TYPE_ATTRIBUTE;
  var TYPE_CLASSNAME = _constants.TYPE_CLASSNAME;
  var TYPE_ELEMENT = _constants.TYPE_ELEMENT;

  var globals = _interopRequire(_globals);

  var hasOwn = _utils.hasOwn;
  var isValidNativeCustomElementName = _utils.isValidNativeCustomElementName;
  var supportsNativeCustomElements = _utils.supportsNativeCustomElements;

  /**
   * Returns the class list for the specified element.
   *
   * @param {Element} element The element to get the class list for.
   *
   * @returns {ClassList | Array}
   */
  function getClassList(element) {
    var classList = element.classList;

    if (classList) {
      return classList;
    }

    var attrs = element.attributes;

    return attrs["class"] && attrs["class"].nodeValue.split(/\s+/) || [];
  }

  module.exports = {
    clear: function clear() {
      globals.registry = {};
      return this;
    },

    get: function get(id) {
      return hasOwn(globals.registry, id) && globals.registry[id];
    },

    getForElement: function getForElement(element) {
      var attrs = element.attributes;
      var attrsLen = attrs.length;
      var definitions = [];
      var isAttr = attrs.is;
      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);

      // Using localName as fallback for edge cases when processing <object> tag that is used
      // as inteface to NPAPI plugin.
      var tag = (element.tagName || element.localName).toLowerCase();
      var isAttrOrTag = isAttrValue || tag;
      var definition;
      var tagToExtend;

      if (this.isType(isAttrOrTag, TYPE_ELEMENT)) {
        definition = globals.registry[isAttrOrTag];
        tagToExtend = definition["extends"];

        if (isAttrValue) {
          if (tag === tagToExtend) {
            definitions.push(definition);
          }
        } else if (!tagToExtend) {
          definitions.push(definition);
        }
      }

      for (var a = 0; a < attrsLen; a++) {
        var attr = attrs[a].nodeName;

        if (this.isType(attr, TYPE_ATTRIBUTE)) {
          definition = globals.registry[attr];
          tagToExtend = definition["extends"];

          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }

      var classList = getClassList(element);
      var classListLen = classList.length;

      for (var b = 0; b < classListLen; b++) {
        var className = classList[b];

        if (this.isType(className, TYPE_CLASSNAME)) {
          definition = globals.registry[className];
          tagToExtend = definition["extends"];

          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }

      return definitions;
    },

    isType: function isType(id, type) {
      var def = this.get(id);
      return def && def.type === type;
    },

    isNativeCustomElement: function isNativeCustomElement(id) {
      return supportsNativeCustomElements() && this.isType(id, TYPE_ELEMENT) && isValidNativeCustomElementName(id);
    },

    set: function set(id, definition) {
      if (hasOwn(globals.registry, id)) {
        throw new Error("A component definition of type \"" + definition.type + "\" with the ID of \"" + id + "\" already exists.");
      }

      globals.registry[id] = definition;

      return this;
    }
  };
});
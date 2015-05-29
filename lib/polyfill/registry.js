(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module', '../constants', '../globals', '../util/has-own'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('../constants'), require('../globals'), require('../util/has-own'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.constants, global.globals, global.hasOwn);
    global.unknown = mod.exports;
  }
})(this, function (exports, module, _constants, _globals, _utilHasOwn) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _globals2 = _interopRequireDefault(_globals);

  var _hasOwn = _interopRequireDefault(_utilHasOwn);

  function getClassList(element) {
    var classList = element.classList;

    if (classList) {
      return classList;
    }

    var attrs = element.attributes;

    return attrs['class'] && attrs['class'].nodeValue.split(/\s+/) || [];
  }

  module.exports = _globals2['default'].registerIfNotExists('registry', {
    definitions: {},

    get: function get(id) {
      return (0, _hasOwn['default'])(this.definitions, id) && this.definitions[id];
    },

    set: function set(id, definition) {
      if ((0, _hasOwn['default'])(this.definitions, id)) {
        throw new Error('A component definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
      }
      this.definitions[id] = definition;
      return this;
    },

    isType: function isType(id, type) {
      var def = this.get(id);
      return def && def.type === type;
    },

    getForElement: function getForElement(element) {
      var attrs = element.attributes;
      var attrsLen = attrs.length;
      var definitions = [];
      var isAttr = attrs.is;
      var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
      var tag = element.tagName.toLowerCase();
      var isAttrOrTag = isAttrValue || tag;
      var definition;
      var tagToExtend;

      if (this.isType(isAttrOrTag, _constants.TYPE_ELEMENT)) {
        definition = this.definitions[isAttrOrTag];
        tagToExtend = definition['extends'];

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

        if (this.isType(attr, _constants.TYPE_ATTRIBUTE)) {
          definition = this.definitions[attr];
          tagToExtend = definition['extends'];

          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }

      var classList = getClassList(element);
      var classListLen = classList.length;

      for (var b = 0; b < classListLen; b++) {
        var className = classList[b];

        if (this.isType(className, _constants.TYPE_CLASSNAME)) {
          definition = this.definitions[className];
          tagToExtend = definition['extends'];

          if (!tagToExtend || tag === tagToExtend) {
            definitions.push(definition);
          }
        }
      }

      return definitions;
    }
  });
});
import {
  TYPE_ATTRIBUTE,
  TYPE_CLASSNAME,
  TYPE_ELEMENT
} from '../constants';

import globals from '../globals';
import hasOwn from '../util/has-own';

function getClassList (element) {
  var classList = element.classList;

  if (classList) {
    return classList;
  }

  var attrs = element.attributes;

  return (attrs['class'] && attrs['class'].nodeValue.split(/\s+/)) || [];
}

export default globals.registerIfNotExists('registry', {
  definitions: {},

  get: function (id) {
    return hasOwn(this.definitions, id) && this.definitions[id];
  },

  set: function (id, definition) {
    if (hasOwn(this.definitions, id)) {
      throw new Error('A component definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
    }
    this.definitions[id] = definition;
    return this;
  },

  isType: function (id, type) {
    var def = this.get(id);
    return def && def.type === type;
  },

  getForElement: function (element) {
    var attrs = element.attributes;
    var attrsLen = attrs.length;
    var definitions = [];
    var isAttr = attrs.is;
    var isAttrValue = isAttr && (isAttr.value || isAttr.nodeValue);
    var tag = element.tagName.toLowerCase();
    var isAttrOrTag = isAttrValue || tag;
    var definition;
    var tagToExtend;

    if (this.isType(isAttrOrTag, TYPE_ELEMENT)) {
      definition = this.definitions[isAttrOrTag];
      tagToExtend = definition.extends;

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
        definition = this.definitions[attr];
        tagToExtend = definition.extends;

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
        definition = this.definitions[className];
        tagToExtend = definition.extends;

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    return definitions;
  }
});

'use strict';

import {
  hasOwn
} from './utils';

if (!window.__skateDefinitions) {
  window.__skateDefinitions = {};
}

/**
 * Returns the class list for the specified element.
 *
 * @param {Element} element The element to get the class list for.
 *
 * @returns {ClassList | Array}
 */
function getClassList (element) {
  var classList = element.classList;

  if (classList) {
    return classList;
  }

  var attrs = element.attributes;

  return (attrs['class'] && attrs['class'].nodeValue.split(/\s+/)) || [];
}

/**
 * Returns whether or not the specified definition can be bound using the
 * specified type.
 *
 * @param {String} id The definition ID.
 * @param {String} type The definition type.
 *
 * @returns {Boolean}
 */
function isDefinitionOfType (id, type) {
  return hasOwn(window.__skateDefinitions, id) && window.__skateDefinitions[id].type.indexOf(type) > -1;
}

export default {
  clear: function () {
    window.__skateDefinitions = {};
    return this;
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

    if (isDefinitionOfType(isAttrOrTag, skate.types.TAG)) {
      definition = window.__skateDefinitions[isAttrOrTag];
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

      if (isDefinitionOfType(attr, skate.types.ATTR)) {
        definition = window.__skateDefinitions[attr];
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

      if (isDefinitionOfType(className, skate.types.CLASS)) {
        definition = window.__skateDefinitions[className];
        tagToExtend = definition.extends;

        if (!tagToExtend || tag === tagToExtend) {
          definitions.push(definition);
        }
      }
    }

    return definitions;
  },

  has: function (id) {
    return hasOwn(window.__skateDefinitions, id);
  },

  set: function (id, definition) {
    if (this.has(id)) {
      throw new Error('A definition of type "' + definition.type + '" with the ID of "' + id + '" already exists.');
    }

    window.__skateDefinitions[id] = definition;

    return this;
  },

  remove: function (id) {
    if (this.has(id)) {
      delete window.__skateDefinitions[id];
    }

    return this;
  }
};

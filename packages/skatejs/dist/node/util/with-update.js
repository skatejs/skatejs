'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

exports.normaliseAttributeDefinition = normaliseAttributeDefinition;
exports.normalisePropertyDefinition = normalisePropertyDefinition;
exports.syncAttributeToProperty = syncAttributeToProperty;
exports.syncPropertyToAttribute = syncPropertyToAttribute;

var _index = require('./index.js');

function normaliseAttributeDefinition(name, prop) {
  const attribute = prop.attribute;

  const obj =
    typeof attribute === 'object'
      ? _extends({}, attribute)
      : {
          source: attribute,
          target: attribute
        };
  if (obj.source === true) {
    obj.source = (0, _index.dashCase)(name);
  }
  if (obj.target === true) {
    obj.target = (0, _index.dashCase)(name);
  }
  return obj;
}

function normalisePropertyDefinition(name, prop) {
  const coerce = prop.coerce,
    def = prop.default,
    deserialize = prop.deserialize,
    serialize = prop.serialize;

  return {
    attribute: normaliseAttributeDefinition(name, prop),
    coerce: coerce || (v => v),
    default: def,
    deserialize: deserialize || (v => v),
    serialize: serialize || (v => v)
  };
}

function syncAttributeToProperty(elem, name, value) {
  if (elem._syncingPropertyToAttribute) {
    return;
  }
  const propDefs = elem.constructor._propsNormalised;
  for (let propName in propDefs) {
    var _propDefs$propName = propDefs[propName];
    const source = _propDefs$propName.attribute.source,
      deserialize = _propDefs$propName.deserialize;

    if (source === name) {
      elem._syncingAttributeToProperty = propName;
      elem[propName] = value == null ? value : deserialize(value);
      elem._syncingAttributeToProperty = null;
    }
  }
}

function syncPropertyToAttribute(elem, target, serialize, val) {
  if (target && elem._syncingAttributeToProperty !== target) {
    const serialized = serialize(val);
    elem._syncingPropertyToAttribute = true;
    if (serialized == null) {
      elem.removeAttribute(target);
    } else {
      elem.setAttribute(target, serialized);
    }
    elem._syncingPropertyToAttribute = false;
  }
}

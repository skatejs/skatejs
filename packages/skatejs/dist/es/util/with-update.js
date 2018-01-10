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

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj &&
          typeof Symbol === 'function' &&
          obj.constructor === Symbol &&
          obj !== Symbol.prototype
          ? 'symbol'
          : typeof obj;
      };

import { dashCase } from './index.js';

export function normaliseAttributeDefinition(name, prop) {
  var attribute = prop.attribute;

  var obj =
    (typeof attribute === 'undefined' ? 'undefined' : _typeof(attribute)) ===
    'object'
      ? _extends({}, attribute)
      : {
          source: attribute,
          target: attribute
        };
  if (obj.source === true) {
    obj.source = dashCase(name);
  }
  if (obj.target === true) {
    obj.target = dashCase(name);
  }
  return obj;
}

export function normalisePropertyDefinition(name, prop) {
  var coerce = prop.coerce,
    def = prop.default,
    deserialize = prop.deserialize,
    serialize = prop.serialize;

  return {
    attribute: normaliseAttributeDefinition(name, prop),
    coerce:
      coerce ||
      function(v) {
        return v;
      },
    default: def,
    deserialize:
      deserialize ||
      function(v) {
        return v;
      },
    serialize:
      serialize ||
      function(v) {
        return v;
      }
  };
}

export function syncAttributeToProperty(elem, name, value) {
  if (elem._syncingPropertyToAttribute) {
    return;
  }
  var propDefs = elem.constructor._propsNormalised;
  for (var propName in propDefs) {
    var _propDefs$propName = propDefs[propName],
      source = _propDefs$propName.attribute.source,
      deserialize = _propDefs$propName.deserialize;

    if (source === name) {
      elem._syncingAttributeToProperty = propName;
      elem[propName] = value == null ? value : deserialize(value);
      elem._syncingAttributeToProperty = null;
    }
  }
}

export function syncPropertyToAttribute(elem, target, serialize, val) {
  if (target && elem._syncingAttributeToProperty !== target) {
    var serialized = serialize(val);
    elem._syncingPropertyToAttribute = true;
    if (serialized == null) {
      elem.removeAttribute(target);
    } else {
      elem.setAttribute(target, serialized);
    }
    elem._syncingPropertyToAttribute = false;
  }
}

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

import { dashCase } from './index.js';

export function normaliseAttributeDefinition(name, prop) {
  const { attribute } = prop;
  const obj =
    typeof attribute === 'object'
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
  const { coerce, default: def, deserialize, serialize } = prop;
  return {
    attribute: normaliseAttributeDefinition(name, prop),
    coerce: coerce || (v => v),
    default: def,
    deserialize: deserialize || (v => v),
    serialize: serialize || (v => v)
  };
}

export function syncAttributeToProperty(elem, name, value) {
  if (elem._syncingPropertyToAttribute) {
    return;
  }
  const propDefs = elem.constructor._propsNormalised;
  for (let propName in propDefs) {
    const { attribute: { source }, deserialize } = propDefs[propName];
    if (source === name) {
      elem._syncingAttributeToProperty = propName;
      elem[propName] = value == null ? value : deserialize(value);
      elem._syncingAttributeToProperty = null;
    }
  }
}

export function syncPropertyToAttribute(elem, target, serialize, val) {
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

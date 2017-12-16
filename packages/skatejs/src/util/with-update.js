// @flow

import type { CustomElement, PropType, PropTypesNormalized } from '../types.js';

import { dashCase } from './index.js';

export function normaliseAttributeDefinition(
  name: string | Symbol,
  prop: PropType
): Object {
  const { attribute } = prop;
  const obj =
    typeof attribute === 'object'
      ? { ...attribute }
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

export function normalisePropertyDefinition(
  name: string,
  prop: PropType
): Object {
  const { coerce, default: def, deserialize, serialize } = prop;
  return {
    attribute: normaliseAttributeDefinition(name, prop),
    coerce: coerce || ((v: mixed) => v),
    default: def,
    deserialize: deserialize || ((v: mixed) => v),
    serialize: serialize || ((v: mixed) => v)
  };
}

export function syncAttributeToProperty(
  elem: any,
  name: string,
  value: mixed
): void {
  if (elem._syncingPropertyToAttribute) {
    return;
  }
  const propDefs: PropTypesNormalized = elem.constructor._propsNormalised;
  for (let propName in propDefs) {
    const { attribute: { source }, deserialize } = propDefs[propName];
    if (source === name) {
      elem._syncingAttributeToProperty = propName;
      (elem: any)[propName] = value == null ? value : deserialize(value);
      elem._syncingAttributeToProperty = null;
    }
  }
}

export function syncPropertyToAttribute(
  elem: any,
  target: string,
  serialize: (val: mixed) => string,
  val: mixed
): void {
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

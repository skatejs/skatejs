// @flow

import type {
  PropOptions,
  PropsOptionsNormalized
} from '../types';

import { dashCase } from '.';

interface CanDefineProps extends HTMLElement {
  static prototype: Object;
  static props: PropsOptionsNormalized;

  _syncingAttributeToProperty: string | null;
  _syncingPropertyToAttribute: boolean;
}

export function normaliseAttributeDefinition (name: string, prop: PropOptions): Object {
  const { attribute } = prop;
  const obj = typeof attribute === 'object' ? { ...attribute } : {
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

export function normalisePropertyDefinition (name: string, prop: PropOptions): Object {
  const { coerce, default: def, deserialize, serialize } = prop;
  return {
    attribute: normaliseAttributeDefinition(name, prop),
    coerce: coerce || ((v: mixed) => v),
    default: def,
    deserialize: deserialize || ((v: mixed) => v),
    serialize: serialize || ((v: mixed) => v)
  };
}

export function syncAttributeToProperty (elem: CanDefineProps, name: string, value: mixed): void {
  if (elem._syncingPropertyToAttribute) {
    return;
  }
  const propDefs: PropsOptionsNormalized = elem.constructor.props;
  for (let propName in propDefs) {
    const { attribute: { source }, deserialize } = propDefs[propName];
    if (source === name) {
      elem._syncingAttributeToProperty = propName;
      (elem: any)[propName] = value == null ? value : deserialize(value);
      elem._syncingAttributeToProperty = null;
    }
  }
}

export function syncPropertyToAttribute (elem: CanDefineProps, target: string, serialize: (val: mixed) => string, val: mixed): void {
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

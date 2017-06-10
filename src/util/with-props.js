// @flow

import type { PropOptions, PropOptionsNormalized } from '../types';

import { dashCase, keys, sym } from '.';

interface CanDefineProps extends HTMLElement {
  static _definedProps: boolean;
  static _normalizedProps: PropOptions;
  static prototype: Object;
  static props: { [string]: PropOptions };

  _syncingAttributeToProperty: string | null;
  _syncingPropertyToAttribute: boolean;
}

export function defineProps (Ctor: Class<CanDefineProps>): void {
  if (Ctor._definedProps) return;
  Ctor._definedProps = true;

  const { prototype } = Ctor;
  const props = normPropDefs(Ctor);

  Object.defineProperties(prototype, keys(props).reduce((prev, curr) => {
    const { attribute: { target }, coerce, default: def, serialize } = props[curr];
    const _value = sym(curr);
    prev[curr] = {
      configurable: true,
      get () {
        const val = this[_value];
        return val == null ? def : val;
      },
      set (val) {
        this[_value] = coerce(val);
        syncPropertyToAttribute(this, target, serialize, val);
        this._updateDebounced();
      }
    };
    return prev;
  }, {}));
}

export function normAttribute (name: string, prop: PropOptions): Object {
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

export function normPropDef (name: string, prop: PropOptions): Object {
  const { coerce, default: def, deserialize, serialize } = prop;
  return {
    attribute: normAttribute(name, prop),
    coerce: coerce || ((v: mixed) => v),
    default: def,
    deserialize: deserialize || ((v: mixed) => v),
    serialize: serialize || ((v: mixed) => v)
  };
}

export function normPropDefs (Ctor: Class<CanDefineProps>): Object {
  return Ctor._normalizedProps || (
    Ctor._normalizedProps = keys(Ctor.props)
      .reduce((prev: Object, curr: string) => {
        prev[curr] = normPropDef(curr, Ctor.props[curr] || {});
        return prev;
      }, {})
  );
}

export function syncAttributeToProperty (elem: CanDefineProps, name: string, value: mixed): void {
  if (elem._syncingPropertyToAttribute) {
    return;
  }
  const propDefs: { [string]: PropOptionsNormalized } = normPropDefs(elem.constructor);
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

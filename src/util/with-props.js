import { dashCase, keys, sym } from '.';

const _definedProps = sym('_definedProps');
const _normPropDef = sym('_normPropDef');
const _syncingAttributeToProperty = sym('_syncingAttributeToProperty');
const _syncingPropertyToAttribute = sym('_syncingPropertyToAttribute');

export const _updateDebounced = sym('_updateDebounced');

export function defineProps (Ctor) {
  if (!Ctor[_definedProps]) {
    Ctor[_definedProps] = true;
  }

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
        this[_updateDebounced]();
      }
    };
    return prev;
  }, {}));
}

export function normAttribute (name, prop) {
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

export function normPropDef (name, prop) {
  const { coerce, default: def, deserialize, serialize } = prop;
  return {
    attribute: normAttribute(name, prop),
    coerce: coerce || (v => v),
    default: def,
    deserialize: deserialize || (v => v),
    serialize: serialize || (v => v)
  };
}

export function normPropDefs (Ctor) {
  return Ctor[_normPropDef] || (
    Ctor[_normPropDef] = keys(Ctor.props)
      .reduce((prev, curr) => {
        prev[curr] = normPropDef(curr, Ctor.props[curr] || {});
        return prev;
      }, {})
  );
}

export function syncAttributeToProperty (elem, name, value) {
  if (elem[_syncingPropertyToAttribute]) {
    return;
  }
  const propDefs = normPropDefs(elem.constructor);
  for (let propName in propDefs) {
    const { attribute: { source }, deserialize } = propDefs[propName];
    if (source === name) {
      elem[_syncingAttributeToProperty] = propName;
      elem[propName] = value == null ? value : deserialize(value);
      elem[_syncingAttributeToProperty] = null;
    }
  }
}

export function syncPropertyToAttribute (elem, target, serialize, val) {
  if (target && elem[_syncingAttributeToProperty] !== target) {
    const serialized = serialize(val);
    elem[_syncingPropertyToAttribute] = true;
    if (serialized == null) {
      elem.removeAttribute(target);
    } else {
      elem.setAttribute(target, serialized);
    }
    elem[_syncingPropertyToAttribute] = false;
  }
}
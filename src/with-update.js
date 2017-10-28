// @flow

import type { PropType, PropTypesNormalized, WithProps } from './types';

import { empty, keys, sym } from './util/index';

import {
  normalisePropertyDefinition,
  syncAttributeToProperty,
  syncPropertyToAttribute
} from './util/with-update';

export function prop(definition: PropType | void): Function {
  const propertyDefinition: PropType = definition || {};

  // Allows decorators, or imperative definitions.
  const func = function({ constructor }, name: string): void {
    const normalised = normalisePropertyDefinition(name, propertyDefinition);
    const _value = sym(name);

    // Ensure that we can cache properties. We have to do this so the _props object literal doesn't modify parent
    // classes or share the instance anywhere where it's not intended to be shared explicitly in userland code.
    if (!constructor.hasOwnProperty('_props')) {
      constructor._props = {};
    }

    // Cache the value so we can reference when syncing the attribute to the property.
    constructor._props[name] = normalised;

    if (normalised.attribute.source) {
      constructor.observedAttributes = normalised.attribute.source;
    }

    Object.defineProperty(constructor.prototype, name, {
      configurable: true,
      get() {
        const val = this[_value];
        return val == null ? normalised.default : val;
      },
      set(val) {
        this[_value] = normalised.coerce(val);
        syncPropertyToAttribute(
          this,
          normalised.attribute.target,
          normalised.serialize,
          val
        );
        this.triggerUpdate();
      }
    });
  };

  // Allows easy extension of pre-defined props { ...prop(), ...{} }.
  Object.keys(propertyDefinition).forEach(
    key => (func[key] = propertyDefinition[key])
  );

  return func;
}

export const withUpdate = (Base?: Class<any> = HTMLElement): Class<WithProps> =>
  class extends Base {
    static _observedAttributes: Array<string>;
    static _props: Object;

    _prevProps: Object;
    _state = {};
    _syncingAttributeToProperty: null | string;
    _syncingPropertyToAttribute: boolean;
    _updating: boolean;

    static get observedAttributes(): Array<string> {
      return this._observedAttributes || [];
    }

    static set observedAttributes(attrs: string | Array<string>) {
      this._observedAttributes = (this.observedAttributes || []).concat(attrs);
    }

    static get props(): PropTypesNormalized {
      return this._props || {};
    }

    static set props(props: PropType): void {
      keys(props).forEach(name => {
        let func = props[name];
        if (typeof func !== 'function') func = prop(func);
        func({ constructor: this }, name);
      });
    }

    get props(): Object {
      return keys(
        this.constructor.props
      ).reduce((prev: Object, curr: string) => {
        prev[curr] = (this: any)[curr];
        return prev;
      }, {});
    }

    set props(props: Object) {
      const ctorProps = this.constructor.props;
      keys(props).forEach(k => k in ctorProps && ((this: any)[k] = props[k]));
    }

    get state() {
      return this._state;
    }

    set state(state: Object) {
      this._state = state;
      this.triggerUpdate && this.triggerUpdate();
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      super.attributeChangedCallback &&
        super.attributeChangedCallback(name, oldValue, newValue);
      syncAttributeToProperty(this, name, newValue);
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.triggerUpdate();
    }

    shouldUpdate() {
      return true;
    }

    triggerUpdate() {
      if (this._updating) return;
      this._updating = true;
      const prev = this._prevProps;
      this.willUpdate && this.willUpdate(prev);
      this.didUpdate && this.shouldUpdate(prev) && this.didUpdate(prev);
      this._prevProps = this.props;
      this._updating = false;
    }
  };

const { parse, stringify } = JSON;
const attribute = Object.freeze({ source: true });
const zeroOrNumber = (val: string): number => (empty(val) ? 0 : Number(val));

const any: Function = prop({
  attribute
});

const array: Function = prop({
  attribute,
  coerce: <T>(val: Array<T> | T): Array<T> | null =>
    Array.isArray(val) ? val : empty(val) ? null : [val],
  default: Object.freeze([]),
  deserialize: parse,
  serialize: stringify
});

const boolean: Function = prop({
  attribute,
  coerce: Boolean,
  default: false,
  deserialize: (val: string): boolean => !empty(val),
  serialize: (val: mixed): null | string => (val ? '' : null)
});

const number: Function = prop({
  attribute,
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: (val: mixed): null | string =>
    empty(val) ? null : String(Number(val))
});

const object: Function = prop({
  attribute,
  default: Object.freeze({}),
  deserialize: parse,
  serialize: stringify
});

const string: Function = prop({
  attribute,
  default: '',
  coerce: String,
  serialize: (val: mixed): null | string => (empty(val) ? null : String(val))
});

export const props = {
  any,
  array,
  boolean,
  number,
  object,
  string
};

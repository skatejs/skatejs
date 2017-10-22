// @flow

import type {
  HasConstructor,
  PropOptions,
  PropsOptionsNormalized
} from './types';

import { empty, keys, sym } from './util/index';

import {
  normalisePropertyDefinition,
  syncAttributeToProperty,
  syncPropertyToAttribute
} from './util/with-props';

export function prop(definition: PropOptions | void): Function {
  const propertyDefinition: PropOptions = definition || {};

  // Allows decorators, or imperative definitions.
  const func = function({ constructor }: HasConstructor, name: string): void {
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

export const withProps = (
  Base?: Class<HTMLElement> = HTMLElement
): Class<HTMLElement> =>
  class extends Base {
    static _observedAttributes: Array<string>;
    static _props: Object;

    _prevProps: Object;
    _syncingAttributeToProperty: null | string;
    _syncingPropertyToAttribute: boolean;
    _updating: boolean;

    propsSetCallback: Function | void;
    propsUpdatedCallback: Function | void;
    triggerUpdate: Function;

    static get observedAttributes(): Array<string> {
      return this._observedAttributes || [];
    }

    static set observedAttributes(attrs: string | Array<string>) {
      this._observedAttributes = (this.observedAttributes || []).concat(attrs);
    }

    static get props(): PropsOptionsNormalized {
      return this._props || {};
    }

    static set props(props: PropOptions): void {
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

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this.triggerUpdate();
    }

    propsChangedCallback() {
      return true;
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

    triggerUpdate() {
      if (this._updating) return;
      this._updating = true;

      const prev = this._prevProps;

      if (this.propsSetCallback) {
        this.propsSetCallback(prev);
      }

      if (this.propsUpdatedCallback && this.propsChangedCallback(prev)) {
        this.propsUpdatedCallback(prev);
      }

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

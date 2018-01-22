// @flow

import type { PropType, PropTypes, PropTypesNormalized } from './types.js';

import { empty, keys, sym } from './util/index.js';

import {
  normalisePropertyDefinition,
  syncAttributeToProperty,
  syncPropertyToAttribute
} from './util/with-update.js';

function defineProps(constructor) {
  if (constructor.hasOwnProperty('_propsNormalised')) return;
  const { props } = constructor;
  keys(props).forEach(name => {
    let func = props[name];
    if (typeof func !== 'function') func = prop((func: any));
    func({ constructor }, name);
  });
}

function delay(fn) {
  if (window.Promise) {
    Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

export function prop(definition: PropType | void): Function {
  const propertyDefinition: PropType = definition || {};

  // Allows decorators, or imperative definitions.
  const func = function({ constructor }, name: string): void {
    const normalised = normalisePropertyDefinition(name, propertyDefinition);
    const _value = sym(name);

    // Ensure that we can cache properties. We have to do this so the _props object literal doesn't modify parent
    // classes or share the instance anywhere where it's not intended to be shared explicitly in userland code.
    if (!constructor.hasOwnProperty('_propsNormalised')) {
      constructor._propsNormalised = {};
    }

    // Cache the value so we can reference when syncing the attribute to the property.
    constructor._propsNormalised[name] = normalised;

    if (normalised.attribute.source) {
      constructor._observedAttributes.push(normalised.attribute.source);
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

export const withUpdate = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    static _observedAttributes: Array<string>;
    static _props: Object;

    _prevProps: Object;
    _changedProps: Array<string>;
    _prevState: Object;
    _state: Object;
    _syncingAttributeToProperty: null | string;
    _syncingPropertyToAttribute: boolean;
    _updating: boolean;
    _wasInitiallyRendered: boolean;

    updated: ?(props: Object, state: Object) => void;
    shouldUpdate: (props: Object, state: Object) => void;
    triggerUpdate: () => void;
    updating: ?(props: Object, state: Object) => void;

    static _observedAttributes = [];
    _prevProps = {};
    _changedProps = [];
    _prevState = {};
    _state = {};

    static get observedAttributes(): Array<string> {
      // We have to define props here because observedAttributes are retrieved
      // only once when the custom element is defined. If we did this only in
      // the constructor, then props would not link to attributes.
      defineProps(this);
      return this._observedAttributes;
    }

    static get props(): PropTypesNormalized {
      return this._props;
    }

    static set props(props: PropTypes): void {
      this._props = props;
    }

    get props(): Object {
      return keys(this.constructor.props).reduce(
        (prev: Object, curr: string) => {
          prev[curr] = (this: any)[curr];
          return prev;
        },
        {}
      );
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
      this.triggerUpdate();
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
      if (!this._changedProps.includes(name)) this._changedProps.push(name)
      syncAttributeToProperty(this, name, newValue);
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.triggerUpdate();
    }

    shouldUpdate() {
      return true;
    }

    triggerUpdate() {
      if (this._updating) {
        return;
      }
      this._updating = true;
      delay(() => {
        const { _prevProps, _prevState, _changedProps } = this;
        if (this.updating) {
          this.updating(_prevProps, _prevState, _changedProps);
        }
        if (this.updated && this.shouldUpdate(_prevProps, _prevState, _changedProps)) {
          this.updated(_prevProps, _prevState, _changedProps);
        }
        this._prevProps = this.props;
        this._prevState = this.state;
        this._changedProps.length = 0;
        this._updating = false;
      });
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

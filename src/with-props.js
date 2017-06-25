// @flow

import type {
  HasConstructor,
  PropOptions,
  PropsOptionsNormalized
} from './types';

import {
  debounce,
  empty,
  keys,
  sym
} from './util';

import {
  normalisePropertyDefinition,
  syncAttributeToProperty,
  syncPropertyToAttribute
} from './util/with-props';

export function prop (definition: PropOptions | void): Function {
  const propertyDefinition: PropOptions = definition || {};

  // Allows decorators, or imperative definitions.
  const func = function ({ constructor }: HasConstructor, name: string): void {
    const normalised = normalisePropertyDefinition(name, propertyDefinition);
    const _value = sym(name);

    // Cache the value so we can reference when syncing the attribute to the property.
    constructor._props[name] = normalised;

    if (normalised.attribute.source) {
      constructor.observedAttributes = normalised.attribute.source;
    }

    Object.defineProperty(constructor.prototype, name, {
      configurable: true,
      get () {
        const val = this[_value];
        return val == null ? normalised.default : val;
      },
      set (val) {
        this[_value] = normalised.coerce(val);
        syncPropertyToAttribute(this, normalised.attribute.target, normalised.serialize, val);
        this._updateDebounced();
      }
    });
  };

  // Allows easy extension of pre-defined props { ...prop(), ...{} }.
  Object.keys(propertyDefinition).forEach(key => (func[key] = propertyDefinition[key]));

  return func;
}

export const withProps = (Base?: Class<HTMLElement> = HTMLElement): Class<HTMLElement> =>
  class extends Base {
    static _observedAttributes: Array<string> = [];
    static _props: PropsOptionsNormalized = {};

    _connected: boolean;
    _constructed: boolean;
    _prevProps: Object;
    _syncingAttributeToProperty: null | string;
    _syncingPropertyToAttribute: boolean;
    _updateDebounced: () => mixed;
    _updating: boolean;

    static get observedAttributes (): Array<string> {
      return this._observedAttributes;
    }

    static set observedAttributes (attrs: string | Array<string>) {
      this._observedAttributes = this.observedAttributes.concat(attrs);
    }

    static get props (): PropsOptionsNormalized {
      return this._props;
    }

    static set props (props: PropOptions): void {
      keys(props).forEach(name => {
        let func = props[name];
        if (typeof func !== 'function') func = prop(func);
        func({ constructor: this }, name);
      });
    }

    get props (): Object {
      return keys(this.constructor.props).reduce((prev: Object, curr: string) => {
        prev[curr] = (this: any)[curr];
        return prev;
      }, {});
    }

    set props (props: Object) {
      const ctorProps = this.constructor.props;
      keys(props).forEach(k => k in ctorProps && ((this: any)[k] = props[k]));
    }

    constructor () {
      super();
      if (this._constructed) return;
      this._constructed = true;
      this._updateDebounced = debounce(this._updateCallback);
    }

    connectedCallback () {
      if (this._connected) return;
      this._connected = true;
      // $FlowFixMe - HTMLElement doesn't implement connectedCallback.
      if (super.connectedCallback) super.connectedCallback();
      this._updateDebounced();
    }

    disconnectedCallback () {
      if (!this._connected) return;
      this._connected = false;
      // $FlowFixMe - HTMLElement doesn't implement disconnectedCallback.
      if (super.disconnectedCallback) super.disconnectedCallback();
    }

    // Called when props actually change.
    propsChangedCallback () {}

    // Called whenever props are set, even if they don't change.
    propsSetCallback () {}

    // Called to see if the props changed.
    propsUpdatedCallback (next: Object, prev: Object) {
      return !prev || keys(prev).some(k => prev[k] !== next[k]);
    }

    attributeChangedCallback (name: string, oldValue: string | null, newValue: string | null) {
      // $FlowFixMe - HTMLElement doesn't implement attributeChangedCallback.
      if (super.attributeChangedCallback) super.attributeChangedCallback(name, oldValue, newValue);
      syncAttributeToProperty(this, name, newValue);
    }

    // Invokes the complete render lifecycle.
    _updateCallback = () => {
      if (this._updating || !this._connected) {
        return;
      }

      // Flag as rendering. This prevents anything from trying to render - or
      // queueing a render - while there is a pending render.
      this._updating = true;

      // Prev / next props for prop lifecycle callbacks.
      const prev = this._prevProps;
      const next = this._prevProps = this.props;

      // Always call set, but only call changed if the props updated.
      this.propsSetCallback(next, prev);
      if (this.propsUpdatedCallback(next, prev)) {
        this.propsChangedCallback(next, prev);
      }

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
  coerce: <T>(val: Array<T> | T): Array<T> | null => Array.isArray(val) ? val : (empty(val) ? null : [val]),
  default: Object.freeze([]),
  deserialize: parse,
  serialize: stringify
});

const boolean: Function = prop({
  attribute,
  coerce: Boolean,
  default: false,
  deserialize: (val: string): boolean => !empty(val),
  serialize: (val: mixed): null | string => val ? '' : null
});

const number: Function = prop({
  attribute,
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: (val: mixed): null | string => empty(val) ? null : String(Number(val))
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
  serialize: (val: mixed): null | string => empty(val) ? null : String(val)
});

export const props = {
  any,
  array,
  boolean,
  number,
  object,
  string
};

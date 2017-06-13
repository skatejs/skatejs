// @flow

import type {
  PropOptions,
  PropOptionsAttribute
} from './types';

import {
  debounce,
  empty,
  keys
} from './util';

import {
  defineProps,
  normPropDefs,
  syncAttributeToProperty
} from './util/with-props';

export const withProps = (Base?: Class<HTMLElement> = HTMLElement): Class<HTMLElement> =>
  class extends Base {
    static _definedProps: boolean;
    static _normalizedProps: { [string]: PropOptions };
    static _observedAttributes: Array<string>;

    static props: { [string]: PropOptions };

    _connected: boolean;
    _constructed: boolean;
    _prevProps: Object;
    _syncingAttributeToProperty: null | string;
    _syncingPropertyToAttribute: boolean;
    _updateDebounced: () => mixed;
    _updating: boolean;

    static get observedAttributes (): Array<string> {
      const props: { [string]: PropOptions } = normPropDefs(this);
      return keys(props)
        .map((k: string): ?PropOptionsAttribute => props[k].attribute)
        .filter(Boolean)
        // $FlowFixMe - find out how to do a.source while accepting non-object primitives.
        .map((a: PropOptionsAttribute) => a.source)
        .concat(this._observedAttributes || []);
    }

    static set observedAttributes (attrs: Array<string>) {
      this._observedAttributes = attrs;
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
      defineProps(this.constructor);
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
      // $FlowFixMe - HTMLElement doesn't implement disConnectedCallback.
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
const createProp = (obj: PropOptions): PropOptions => Object.freeze({ ...{ attribute }, ...obj });
const zeroOrNumber = (val: string): number => (empty(val) ? 0 : Number(val));

const array: PropOptions = createProp({
  coerce: <T>(val: Array<T> | T): Array<T> | null => Array.isArray(val) ? val : (empty(val) ? null : [val]),
  default: Object.freeze([]),
  deserialize: parse,
  serialize: stringify
});

const boolean: PropOptions = createProp({
  coerce: Boolean,
  default: false,
  deserialize: (val: string): boolean => !empty(val),
  serialize: (val: mixed): null | string => val ? '' : null
});

const number: PropOptions = createProp({
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: (val: mixed): null | string => empty(val) ? null : String(Number(val))
});

const object: PropOptions = createProp({
  default: Object.freeze({}),
  deserialize: parse,
  serialize: stringify
});

const string: PropOptions = createProp({
  default: '',
  coerce: String,
  serialize: (val: mixed): null | string => empty(val) ? null : String(val)
});

export const props = {
  array,
  boolean,
  number,
  object,
  string
};

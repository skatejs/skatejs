// @flow

import {
  debounce,
  empty,
  freeze,
  HTMLElement,
  keys,
  sym
} from './util';
import {
  _updateDebounced,
  defineProps,
  normPropDefs,
  syncAttributeToProperty
} from './util/with-props';

// Unfortunately the polyfills still seem to double up on lifecycle calls. In
// order to get around this, we need guards to prevent us from executing them
// more than once for a given state.
const _connected = sym('_connected');
const _constructed = sym('_constructed');

const _observedAttributes = sym('_observedAttributes');
const _prevProps = sym('_prevProps');
const _props = sym('_props');
const _updateCallback = sym('_updateCallback');
const _updating = sym('_updating');

export const withProps = (Base?: Class<HTMLElement>): Class<HTMLElement> =>
  class extends (Base || HTMLElement) {
    static get observedAttributes () {
      const props = normPropDefs(this);
      return keys(props)
        .map(k => props[k].attribute)
        .filter(Boolean)
        .map(a => a.source)
        .concat(this[_observedAttributes] || []);
    }

    static set observedAttributes (attrs) {
      this[_observedAttributes] = attrs;
    }

    static get props () {
      return this[_props];
    }

    static set props (props) {
      this[_props] = props;
    }

    get props (): Object {
      return keys(this.constructor.props).reduce((prev, curr) => {
        prev[curr] = this[curr];
        return prev;
      }, {});
    }

    set props (props: Object) {
      const ctorProps = this.constructor.props;
      keys(props).forEach(k => k in ctorProps && (this[k] = props[k]));
    }

    constructor () {
      super();
      if (this[_constructed]) return;
      this[_constructed] = true;
      const { constructor } = this;
      defineProps(constructor);
      this[_updateDebounced] = debounce(this[_updateCallback]);
    }

    connectedCallback () {
      if (this[_connected]) return;
      this[_connected] = true;
      if (super.connectedCallback) super.connectedCallback();
      // $FlowFixMe
      this[_updateDebounced]();
    }

    disconnectedCallback () {
      if (!this[_connected]) return;
      this[_connected] = false;
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
      if (super.attributeChangedCallback) super.attributeChangedCallback(name, oldValue, newValue);
      syncAttributeToProperty(this, name, newValue);
    }

    // Invokes the complete render lifecycle.
    // $FlowFixMe
    [_updateCallback] = () => {
      if (this[_updating] || !this[_connected]) {
        return;
      }

      // Flag as rendering. This prevents anything from trying to render - or
      // queueing a render - while there is a pending render.
      this[_updating] = true;

      // Prev / next props for prop lifecycle callbacks.
      const prev = this[_prevProps];
      const next = this[_prevProps] = this.props;

      // Always call set, but only call changed if the props updated.
      this.propsSetCallback(next, prev);
      if (this.propsUpdatedCallback(next, prev)) {
        this.propsChangedCallback(next, prev);
      }

      this[_updating] = false;
    }
  };

// Props

const { parse, stringify } = JSON;
const attribute = freeze({ source: true });
const createProp = (obj: Object): Object => freeze({ ...{ attribute }, ...obj });
const nullOrType = type => val => empty(val) ? null : type(val);
const zeroOrNumber = (val: number): number => (empty(val) ? 0 : Number(val));

const array: Object = createProp({
  coerce: (val: any): Array<any> | null => Array.isArray(val) ? val : (empty(val) ? null : [val]),
  default: freeze([]),
  deserialize: parse,
  serialize: stringify
});

const boolean: Object = createProp({
  coerce: Boolean,
  default: false,
  deserialize: (val: string): boolean => !empty(val),
  serialize: (val: any): string | null => val ? '' : null
});

const number: Object = createProp({
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: nullOrType(Number)
});

const object: Object = createProp({
  default: freeze({}),
  deserialize: parse,
  serialize: stringify
});

const string: Object = createProp({
  default: '',
  coerce: String,
  serialize: nullOrType(String)
});

export const props = {
  array,
  boolean,
  number,
  object,
  string
};

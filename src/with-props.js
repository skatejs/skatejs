import {
  debounce,
  keys,
  sym
} from './util';
import {
  _updateDebounced,
  defineProps,
  normPropDefs,
  syncAttributeToProperty
} from './util/with-props';

const { HTMLElement } = root;

const _connected = sym();
const _constructed = sym();

const _observedAttributes = sym();
const _prevProps = sym();
const _props = sym();
const _updateCallback = sym();
const _updating = sym();

export function withProps (Base = HTMLElement) {
  return class extends Base {
    static get observedAttributes () {
      const props = normPropDefs(this);
      return keys(props)
        .map(k => props[k].attribute)
        .filter(Boolean)
        .map(a => a.source)
        .concat(this[_observedAttributes] || []);
    }

    static set observedAttributes (value) {
      this[_observedAttributes] = value;
    }

    static get props () {
      return { ...super.props, ...this[_props] };
    }

    static set props (value) {
      this[_props] = value;
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
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this[_updateDebounced]();
    }

    disconnectedCallback () {
      if (!this[_connected]) return;
      this[_connected] = false;
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
    }

    // Called when props actually change.
    propsChangedCallback () {}

    // Called whenever props are set, even if they don't change.
    propsSetCallback () {}

    // Called to see if the props changed.
    propsUpdatedCallback (next, prev) {
      // The 'previousProps' will be undefined if it is the initial render.
      if (!prev) {
        return true;
      }

      // The 'prevProps' will always contain all of the keys.
      //
      // Use classic loop because:
      //
      // - for ... in skips symbols
      // - for ... of is not working yet with IE!?
      const namesAndSymbols = keys(prev);
      for (let i = 0; i < namesAndSymbols.length; i++) {
        const nameOrSymbol = namesAndSymbols[i];
        if (prev[nameOrSymbol] !== next[nameOrSymbol]) {
          return true;
        }
      }

      return false;
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
      syncAttributeToProperty(this, name, newValue);
    }

    // Invokes the complete render lifecycle.
    [_updateCallback] = () => {
      if (this[_updating] || !this[_connected]) {
        return;
      }

      // Flag as rendering. This prevents anything from trying to render - or
      // queueing a render - while there is a pending render.
      this[_updating] = true;

      // Prev / next props for prop lifecycle callbacks.
      const prev = this[_prevProps];
      const next = this[_prevProps] = getProps(this);

      // Always call set, but only call changed if the props updated.
      this.propsSetCallback(next, prev);
      if (this.propsUpdatedCallback(next, prev)) {
        this.propsChangedCallback(next, prev);
      }

      this[_updating] = false;
    }
  };
}

// Props

const { freeze } = Object;
const attribute = freeze({ source: true });
const zeroIfEmptyOrNumberIncludesNaN = val => (val == null ? 0 : Number(val));

export const propArray = freeze({
  attribute,
  coerce: val => (Array.isArray(val) ? val : (val == null ? null : [val])),
  default: freeze([]),
  deserialize: JSON.parse,
  serialize: JSON.stringify
});

export const propBoolean = freeze({
  attribute,
  coerce: val => !!val,
  default: false,
  deserialize: val => val != null,
  serialize: val => val ? '' : null
});

export const propNumber = freeze({
  attribute,
  default: 0,
  coerce: zeroIfEmptyOrNumberIncludesNaN,
  deserialize: zeroIfEmptyOrNumberIncludesNaN,
  serialize: v => v == null ? null : Number(v)
});

export const propObject = freeze({
  attribute,
  default: freeze({}),
  deserialize: JSON.parse,
  serialize: JSON.stringify
});

export const propString = freeze({
  attribute,
  default: '',
  coerce: v => String(v),
  deserialize: v => v,
  serialize: v => v == null ? null : String(v)
});

export function getProps (elem) {
  return keys(elem.constructor.props).reduce((prev, curr) => {
    prev[curr] = elem[curr];
    return prev;
  }, {});
}

export function setProps (elem, props) {
  keys(props).forEach(k => (elem[k] = props[k]));
}

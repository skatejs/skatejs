import {
  debounce,
  empty,
  freeze,
  keys,
  root,
  sym
} from './util';
import {
  _updateDebounced,
  defineProps,
  normPropDefs,
  syncAttributeToProperty
} from './util/with-props';

const { HTMLElement } = root;

// Unfortunately the polyfills still seem to double up on lifecycle calls. In
// order to get around this, we need guards to prevent us from executing them
// more than once for a given state.
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
      return this[_props];
    }

    static set props (value) {
      this[_props] = value;
    }

    get props () {
      return keys(this.constructor.props).reduce((prev, curr) => {
        prev[curr] = this[curr];
        return prev;
      }, {});
    }

    set props (props) {
      keys(this.constructor.props).forEach(k => (this[k] = props[k]));
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
    propsUpdatedCallback (next, prev) {
      return !prev || keys(prev).every(k => prev[k] === next[k]);
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (super.attributeChangedCallback) super.attributeChangedCallback(name, oldValue, newValue);
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
      const next = this[_prevProps] = this.props;

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

const { parse, stringify } = JSON;
const attribute = freeze({ source: true });
const createProp = obj => freeze({ ...{ attribute }, ...obj });
const nullOrType = type => val => empty(val) ? null : type(val);
const zeroOrNumber = val => (empty(val) ? 0 : Number(val));

const array = createProp({
  coerce: val => Array.isArray(val) ? val : (empty(val) ? null : [val]),
  default: freeze([]),
  deserialize: parse,
  serialize: stringify
});

const boolean = createProp({
  coerce: Boolean,
  default: false,
  deserialize: val => !empty(val),
  serialize: val => val ? '' : null
});

const number = createProp({
  default: 0,
  coerce: zeroOrNumber,
  deserialize: zeroOrNumber,
  serialize: nullOrType(Number)
});

const object = createProp({
  default: freeze({}),
  deserialize: parse,
  serialize: stringify
});

const string = createProp({
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

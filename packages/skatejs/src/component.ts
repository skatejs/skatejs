import { props } from './props';
import {
  CustomElement,
  CustomElementConstructor,
  NormalizedPropTypes,
  ObservedAttributes,
  PropTypes
} from './types';
import { Map } from 'core-js';

// @ts-ignore
const mapAttrsToProps = new Map();
// @ts-ignore
const mapPropsToTypes = new Map();
// @ts-ignore
const mapNativeToPropType = new Map();

mapNativeToPropType.set(Array, props.array);
mapNativeToPropType.set(Boolean, props.boolean);
mapNativeToPropType.set(Number, props.number);
mapNativeToPropType.set(Object, props.object);
mapNativeToPropType.set(String, props.string);

function delay(fn) {
  if (typeof global.Promise === 'function') {
    // @ts-ignore - Promise.resove() indeed does exist.
    global.Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

function deriveAttrsFromProps(props: NormalizedPropTypes): ObservedAttributes {
  return props.map(({ propType }) => propType.source as string);
}

function ensureFunction(type: any): (string) => any {
  return typeof type === 'function' ? type : () => type;
}

function normalizePropTypes(propTypes: PropTypes): NormalizedPropTypes {
  return Object.keys(propTypes).map(propName => {
    const propType =
      mapNativeToPropType.get(propTypes[propName]) ||
      propTypes[propName] ||
      props.any;
    return {
      propName,
      propType: {
        deserialize: ensureFunction(propType.deserialize),
        serialize: ensureFunction(propType.serialize),
        source: ensureFunction(propType.source)(propName),
        target: ensureFunction(propType.target)(propName)
      }
    };
  });
}

function observeChildren(elem) {
  const hasChildrenChanged = elem.childrenChanged;
  const hasChildrenPropType = elem.constructor.props.children;

  if (hasChildrenChanged || hasChildrenPropType) {
    const mo = new MutationObserver(() => {
      if (hasChildrenChanged) {
        elem.childrenChanged();
      }
      if (hasChildrenPropType) {
        elem.forceUpdate();
      }
    });

    // We only need to observe direct children since we only care about light
    // DOM.
    mo.observe(elem, { childList: true });

    // We wait for DOMContentLoaded to ensure the childList is complete. We
    // also don't need to forceUpdate here as that will happen anyways.
    if (hasChildrenChanged) {
      document.addEventListener('DOMContentLoaded', () => {
        elem.childrenChanged();
      });
    }
  }
}

export function component(
  Base: CustomElementConstructor = HTMLElement
): CustomElementConstructor {
  return class extends Base implements CustomElement {
    _prevProps: Object = {};
    _prevState: Object = {};
    _props: Object = {};
    _state: Object = {};
    _updating: boolean = false;

    ['constructor']: CustomElementConstructor;

    static props?: PropTypes = {};

    static get observedAttributes() {
      const props = normalizePropTypes(this.props);

      mapAttrsToProps.set(this, {});
      mapPropsToTypes.set(this, {});

      props.forEach(({ propName, propType }) => {
        const { serialize, source, target } = propType;

        mapAttrsToProps.get(this)[source as string] = propName;
        mapPropsToTypes.get(this)[propName] = propType;

        Object.defineProperty(this.prototype, propName, {
          configurable: true,
          get() {
            return this._props[propName];
          },
          set(propValue) {
            const oldPropValue = this._props[propName];
            this._props[propName] = propValue;
            this.propChanged(propName, oldPropValue, propValue);
            if (target) {
              // We must delay attribute sets because property sets that are
              // initialized in the constructor result in attributes being set
              // and if an attribute is set in the constructor, the DOM throws.
              delay(() => {
                const attrValue = serialize(propValue);
                if (attrValue == null) {
                  this.removeAttribute(target);
                } else {
                  this.setAttribute(target, attrValue);
                }
              });
            }
            this.forceUpdate();
          }
        });
      });

      return deriveAttrsFromProps(props);
    }

    get props() {
      return this._props;
    }

    set props(props: Object) {
      for (const key in this.constructor.props) {
        this[key] = props[key];
      }
    }

    get renderRoot() {
      return this.shadowRoot || this.attachShadow({ mode: 'open' });
    }

    get state() {
      return this._state;
    }

    set state(state: Object) {
      this._state = state;
      this.forceUpdate();
    }

    constructor() {
      super();

      // TODO is there a better way and to still make this declarative: renderer = renderer;
      this.renderer = (root, func) => (root.innerHTML = func());
    }

    attributeChangedCallback(
      attrName: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }

      const { constructor } = this;
      const propName = mapAttrsToProps.get(constructor)[attrName];

      if (propName) {
        this._props[propName] = mapPropsToTypes
          .get(constructor)
          [propName].deserialize(newValue);
        this.forceUpdate();
      }
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      // We observe updates when connected because there's no point in
      // observing if it's not connected yet.
      observeChildren(this);

      // This does the initial render. This is necessary as props wouldn't be
      // triggering a render yet.
      this.forceUpdate();
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      // Rendering null here allows renderers to perform any necessary
      // unmounting logic if need be.
      this.renderer(this.renderRoot, () => null);
    }

    forceUpdate(): void {
      // We don't need to render when:
      //
      // - We're not connected.
      // - We're already updating.
      if (!this.parentNode || this._updating) {
        return;
      }

      // This flag prevents infinite loops if another update is triggered while
      // performing the current update.
      this._updating = true;

      // We execute the update process at the end of the current microtask so
      // we can debounce any subsequent updates using the _updating flag.
      delay(() => {
        const { _prevProps, _prevState } = this;
        this.updated(_prevProps, _prevState);
        if (this.shouldUpdate(_prevProps, _prevState)) {
          this.renderer(this.renderRoot, () => this.render());
          this.rendered(_prevProps, _prevState);
        }
        this._prevProps = this.props;
        this._prevState = this.state;
        this._updating = false;
      });
    }

    propChanged(name: string, oldValue: any, newValue: any) {}

    rendered(props: Object, state: Object) {}

    shouldUpdate(props: Object, state: Object): boolean {
      return true;
    }

    updated(props: Object, state: Object) {}
  };
}

export const Component = component();

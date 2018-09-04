import props from './props';
import {
  CustomElement,
  CustomElementConstructor,
  NormalizedPropType,
  NormalizedPropTypes,
  ObservedAttributes,
  Props,
  PropTypes
} from './types';

// @ts-ignore
const mapAttrsToProps = new Map();
// @ts-ignore
const mapPropsToTypes = new Map();
// @ts-ignore
const mapNativeToPropType = new Map();

mapNativeToPropType.set(Array, props.array);
mapNativeToPropType.set(Boolean, props.boolean);
mapNativeToPropType.set(Event, props.event);
mapNativeToPropType.set(Number, props.number);
mapNativeToPropType.set(Object, props.object);
mapNativeToPropType.set(String, props.string);

function defineProp(
  ctor: CustomElementConstructor,
  propName: string,
  propType: NormalizedPropType
) {
  const { source, target } = propType;

  mapAttrsToProps.get(ctor)[source as string] = propName;
  mapPropsToTypes.get(ctor)[propName] = propType;

  Object.defineProperty(ctor.prototype, propName, {
    configurable: true,
    get() {
      const value = propType.get(this, propName, this._props[propName]);
      return value == null ? propType.default(this, propName) : value;
    },
    set(newPropValue) {
      const oldPropValue = this._props[propName];
      this._propsChanged[propName] = oldPropValue;
      this._props[propName] = propType.set(
        this,
        propName,
        oldPropValue,
        newPropValue
      );

      if (target) {
        // We must delay attribute sets because property sets that are
        // initialized in the constructor result in attributes being set
        // and if an attribute is set in the constructor, the DOM throws.
        delay(() => {
          const attrValue = propType.serialize(
            this,
            propName,
            oldPropValue,
            newPropValue
          );
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

  propType.defined(ctor, propName);
}

function defineProps(ctor: CustomElementConstructor) {
  const props = normalizePropTypes(ctor.props);
  mapAttrsToProps.set(ctor, {});
  mapPropsToTypes.set(ctor, {});
  props.forEach(({ propName, propType }) =>
    defineProp(ctor, propName, propType)
  );
}

function delay(fn) {
  if (typeof global.Promise === 'function') {
    // @ts-ignore - Promise.resove() indeed does exist.
    global.Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

function deriveAttrsFromProps(
  ctor: CustomElementConstructor
): ObservedAttributes {
  return normalizePropTypes(ctor.props).map(
    ({ propType }) => propType.source as string
  );
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
        // Pass on everything else as custom prop types may require additional
        // options be passed as part of the definition.
        ...propType,
        default: ensureFunction(propType.default),
        defined: ensureFunction(propType.defined),
        deserialize: ensureFunction(propType.deserialize),
        get: ensureFunction(propType.get),
        serialize: ensureFunction(propType.serialize),
        set: ensureFunction(propType.set),
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
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          elem.childrenChanged();
        });
      } else {
        elem.childrenChanged();
      }
    }
  }
}

export default function(
  Base: CustomElementConstructor = HTMLElement
): CustomElementConstructor {
  return class extends Base implements CustomElement {
    private _props: Props = {};
    private _propsChanged: Props = {};
    private _propsUpdating: boolean = false;

    ['constructor']: CustomElementConstructor;

    static props?: PropTypes = {};

    static get observedAttributes() {
      defineProps(this);
      return deriveAttrsFromProps(this);
    }

    get renderRoot() {
      return this.attachShadow
        ? this.shadowRoot || this.attachShadow({ mode: 'open' })
        : this;
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
      if (this.render) {
        this.renderer(this.renderRoot, () => null);
      }
    }

    forceUpdate(): void {
      // We don't need to render when:
      //
      // - We're not connected.
      // - We're already updating.
      if (!this.parentNode || this._propsUpdating) {
        return;
      }

      // This flag prevents infinite loops if another update is triggered while
      // performing the current update.
      this._propsUpdating = true;

      // We execute the update process at the end of the current microtask so
      // we can debounce any subsequent updates using the _updating flag.
      delay(() => {
        this.updated(this._propsChanged);
        if (this.shouldRender(this._propsChanged)) {
          this.renderer(this.renderRoot, () => this.render());
          this.rendered(this._propsChanged);
        }
        this._propsChanged = {};
        this._propsUpdating = false;
      });
    }

    rendered(props: Props) {}

    renderer(root, func) {
      root.innerHTML = func();
    }

    shouldRender(props: Props) {
      return !!this.render;
    }

    updated(props: Props) {}
  };
}

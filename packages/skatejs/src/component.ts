import {
  NormalizedPropType,
  NormalizedPropTypes,
  props,
  PropType,
  PropTypes
} from './props';
import { CustomElement, CustomElementConstructor } from './types';

export type ObservedAttributes = Array<string>;

const mapAttributesToProps: { [s: string]: { [s: string]: string } } = {};
const mapDefaultProps: { [s: string]: any } = {};
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

function deriveAttributesFromProps(props: PropTypes): ObservedAttributes {
  return normalizePropTypes(props).map(({ propName, propType }) =>
    propType.source(propName)
  );
}

function derivePropsFromConnectedInstance(elem: HTMLElement): PropTypes {
  const prot = elem.constructor.prototype;
  return Object.keys(elem)
    .filter(propName => !(propName in prot) || propName[0] !== '_')
    .reduce((propType, propName) => {
      propType[propName] = derivePropTypeFromValue(elem[propName]);
      return propType;
    }, {});
}

function derivePropTypeFromValue(propValue: any): NormalizedPropType {
  return propValue == null
    ? props.any
    : normalizePropType(propValue.constructor);
}

function normalizePropType(propType: PropType): NormalizedPropType {
  return mapNativeToPropType.get(propType) || propType || props.any;
}

function normalizePropTypes(propTypes: PropTypes): NormalizedPropTypes {
  return Object.keys(propTypes).map(propName => ({
    propName,
    propType: normalizePropType(propTypes[propName])
  }));
}

// When proxies are a thing, we can remove most of this code but we still need
// a MutationObserver because there's no way to listen to all attribute
// changes.
function defineProperties(elem: CustomElement) {
  const constructor = elem.constructor as CustomElementConstructor;
  const localName = elem.localName;
  let propDefs = mapDefaultProps[localName];

  // If defaults have been set, we've already defined props for this type of
  // element.
  if (propDefs) {
    return;
  }

  // We cache the defaults so we don't have to do this again.
  propDefs = mapDefaultProps[localName] = {};
  mapAttributesToProps[localName] = {};

  // We allow the consumer to explicitly define their props but fallback to
  // trying to auto-detect props if they're not specified. This allows us to
  // favour ergonomics and simplicity over performance in the most simple case
  // but also allow explicit definition for those who prefer to do so, or want
  // to favour performance.
  normalizePropTypes(
    constructor.props || derivePropsFromConnectedInstance(elem)
  ).forEach(({ propName, propType }) => {
    const attrName = propType.target(propName);
    const propDesc = {
      configurable: true,
      get() {
        return propName in this._props
          ? this._props[propName]
          : propDefs[propName];
      },
      set(propValue) {
        this._props[propName] = propValue;
        if (attrName) {
          const attrValue = propType.serialize(propValue);
          if (attrValue == null) {
            this.removeAttribute(attrName);
          } else {
            this.setAttribute(attrName, attrValue);
          }
        }
        this.forceUpdate();
      }
    };

    // Register the default value so it can be returned by the getter.
    propDefs[propName] = elem[propName];

    // Register an attribute mapping so this can be looked up by attribute
    // handlers.
    mapAttributesToProps[localName][propName] = attrName;

    // Patching the prototype ensures all future instances get the property
    // definition without having to redefine on construct.
    Object.defineProperty(constructor.prototype, propName, propDesc);

    // The current instance still needs to be patched since we've done this
    // lazily.
    Object.defineProperty(elem, propName, propDesc);
  });
}

function observe(
  host: HTMLElement,
  observer: (EventListenerOrEventListenerObject) => void
) {
  const mo = new MutationObserver(observer);
  mo.observe(host, { attributes: true, childList: true });
  document.addEventListener('DOMContentLoaded', observer);
}

function observeUpdates(elem) {
  const hasChildrenUpdated = elem.childrenUpdated;
  const shouldObserveAllAttributes =
    elem.constructor.observedAttributes.indexOf('*') > -1;

  // We don't want the overhead of a MutationObserver if it's not necessary.
  if (!hasChildrenUpdated && !shouldObserveAllAttributes) {
    return;
  }

  observe(elem, mutations => {
    let shouldCallChildrenUpdated = false;

    mutations.forEach(mutation => {
      if (shouldObserveAllAttributes && mutation.type === 'attribute') {
        const { attributeName, oldValue } = mutation;

        // Don't call for certain attributes which can still be opt-in by
        // specifying them explicitly.
        if (attributeName === 'style') {
          return;
        }

        // We have to invoke this for every mutation as that's what the spec
        // does.
        elem.attributeChangedCallback(
          attributeName,
          oldValue,
          elem.getAttribute(attributeName)
        );
      } else if (hasChildrenUpdated && mutation.type === 'childList') {
        // We only want to invoke this once to limit perf implications.
        shouldCallChildrenUpdated = true;
      }
    });

    if (shouldCallChildrenUpdated) {
      elem.childrenUpdated();
    }
  });
}

export function component(
  Base: CustomElementConstructor = HTMLElement
): CustomElementConstructor {
  return class extends Base {
    static props?: PropTypes;
    _prevProps: Object = {};
    _prevState: Object = {};
    _props: Object = {};
    _state: Object = {};
    _updating: boolean = false;
    ['constructor']: CustomElementConstructor;
    childrenUpdated?();

    static get observedAttributes() {
      const { props } = this;

      // "*" has special meaning that we should be observing all changes except
      // certain ones that get spammy, such as "style". We do this by default
      // if there's no props specified so we can use derived props for re-
      // rendering the component.
      //
      // If you define props explicitly, then it derives your observed
      // attributes from those definitions and will not listen to all updates.
      return props ? deriveAttributesFromProps(props) : ['*'];
    }

    get props() {
      return this._props;
    }

    get renderRoot() {
      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }
      return this.shadowRoot;
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
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }

      const { constructor, localName } = this;
      const propertyName = mapAttributesToProps[localName][name];

      if (propertyName) {
        this._props[propertyName] = constructor.props[propertyName].deserialize(
          newValue
        );
        this.forceUpdate();
      }
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      observeUpdates(this);

      // We define properties here as it's necessary for deriving props, but it
      // also allows us to defer any expensive work until the latest possible
      // point. Props serve as a way to trigger a rendering of your component,
      // so it doesn't make sense to define them if the component doesn't need
      // to ever render, which would be the case if it's never connected.
      defineProperties(this);

      // This does the initial render. This is necessary as props wouldn't be
      // triggering a render yet.
      this.forceUpdate();
    }

    forceUpdate(): void {
      if (this._updating) {
        return;
      }

      // This flag prevents infinite loops if another update is triggered while
      // performing the current update.
      this._updating = true;

      // We execute the update process at the end of the current microtask so
      // we can debounce any subsequent updates using the _updating flag.
      delay(() => {
        const { _prevProps, _prevState } = this;
        if (this.shouldUpdate(_prevProps, _prevState)) {
          this.renderer(this.renderRoot, this.render.call(this));
          if (this.updated) {
            this.updated(_prevProps, _prevState);
          }
        }
        this._prevProps = this.props;
        this._prevState = this.state;
        this._updating = false;
      });
    }

    shouldUpdate(props: Object, state: Object): boolean {
      return true;
    }
  };
}

export const Component = component();

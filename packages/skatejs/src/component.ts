import { CustomElementConstructor } from './types';
import { observe } from './observe';
import { shadow } from './shadow';

const mapDefaultProps = {};

function delay(fn) {
  if (typeof global.Promise === 'function') {
    // @ts-ignore - Promise.resove() indeed does exist.
    global.Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

// TODO make this compatible with the old API.
function defineProperties(elem) {
  const ctor = elem.constructor;
  let defs = mapDefaultProps[elem.localName];

  // If we've already defined props, we don't do anything.
  if (defs) {
    return;
  }

  defs = mapDefaultProps[elem.localName] = {};
  const prot = ctor.prototype;

  // Property / attribute mapping.
  const attrToPropMap = ctor.attrs || {};
  const propToAttrMap = {};

  // Pre-cache the prop-to-attr map from the attr-to-prop-map.
  Object.keys(attrToPropMap).forEach(name => {
    propToAttrMap[attrToPropMap[name]] = name;
  });

  // Take all statically defiend props. If deriving props, ignore props that:
  //
  // - have already been defined on the prototype.
  // - have a leading underscore.
  (
    ctor.props ||
    Object.keys(elem).filter(
      propName => !(propName in prot) || propName[0] !== '_'
    )
  ).forEach(propName => {
    const desc = {
      configurable: true,
      get() {
        return propName in this._props ? this._props[propName] : defs[propName];
      },
      set(propValue) {
        this._props[propName] = propValue;
        if (propName in propToAttrMap) {
          const attrName = propToAttrMap[propName];
          if (propName == null) {
            this.removeAttribute(attrName);
          } else {
            this.setAttribute(attrName, propValue);
          }
        }
        this.forceUpdate();
      }
    };
    defs[propName] = elem[propName];

    // Patching the prototype ensures all future instances get the
    // property definition without having to redefine on construct.
    Object.defineProperty(prot, propName, desc);

    // The current instance still needs to be patched since we've
    // doen this lazily.
    Object.defineProperty(elem, propName, desc);
  });
}

export function component(
  Base: CustomElementConstructor = HTMLElement
): CustomElementConstructor {
  return class extends Base {
    ['constructor']: CustomElementConstructor;

    _boundRender: () => any;
    _prevProps: {} = {};
    _prevState: {} = {};
    _props: {} = {};
    _state: {} = {};
    _updating: boolean = false;
    childrenUpdated?();

    static _attrToPropMap = {};
    static _propToAttrMap = {};
    static props?: Array<string>;

    get props(): {} {
      return this._props;
    }

    set props(props: {}) {
      this._props = props;
    }

    get state(): {} {
      return this._state;
    }

    set state(state: {}) {
      this._state = state;
      this.forceUpdate();
    }

    constructor() {
      super();

      // TODO is there a better way and to still make this declarative: renderer = renderer;
      this.renderer = (root, func) => (root.innerHTML = func());

      // TODO make this a getter.
      this.renderRoot = shadow(this);
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ) {
      const { _attrToPropMap, props } = this.constructor;

      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }

      const propertyName = _attrToPropMap[name];
      const propertyFunc = props[propertyName];

      if (propertyFunc) {
        this._props[propertyName] = propertyFunc(newValue);
        this.forceUpdate();
      }
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (this.childrenUpdated) {
        observe(this, this.childrenUpdated.bind(this));
      }

      defineProperties(this);
      this.forceUpdate();
    }

    forceUpdate(): void {
      if (this._updating) {
        return;
      }

      if (!this._boundRender) {
        this._boundRender = this.render.bind(this);
      }

      // This flag prevents infinite loops if another update is triggered while
      // performing the current update.
      this._updating = true;

      // We execute the update process at the end of the current microtask so
      // we can debounce any subsequent updates using the _updating flag.
      delay(() => {
        const { _prevProps, _prevState } = this;
        if (this.shouldUpdate(_prevProps, _prevState)) {
          this.renderer(this.renderRoot, this._boundRender);
          if (this.updated) {
            this.updated(_prevProps, _prevState);
          }
        }
        this._prevProps = this.props;
        this._prevState = this.state;
        this._updating = false;
      });
    }

    shouldUpdate(props: {}, state: {}): boolean {
      return true;
    }
  };
}

export const Component = component();

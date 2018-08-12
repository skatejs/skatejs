import { CustomElementConstructor } from './types';
import { observe } from './observe';
import { shadow } from './shadow';

function delay(fn) {
  if (typeof global.Promise === 'function') {
    // @ts-ignore - Promise.resove() indeed does exist.
    global.Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

export function component(
  Base: CustomElementConstructor
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

    // This is invoked once when the element is defined. Due to this, we must
    // link props to attrs here as opposed to doing it in the constructor.
    static get observedAttributes(): Array<string> {
      const { attrs, props } = this;
      return Object.keys(props).reduce((observedAttrs, propName) => {
        // We're opinionated about the propName -> propname (attribute)
        // convention.
        const attrName = propName.toLowerCase();

        // Don't set props from attributes if there is no handler. This also
        // means we don't need to observe them at all.
        if (this.props[propName]) {
          this._attrToPropMap[attrName] = propName;
          this._propToAttrMap[propName] = attrName;
          observedAttrs = observedAttrs.concat(attrName);
        }

        // Defines a property to ensure it triggers an updated and syncs the
        // corresponding attribute.
        Object.defineProperty(this.prototype, propName, {
          configurable: true,
          get() {
            return this._props[propName];
          },
          set(propValue) {
            this._props[propName] = propValue;
            if (propName in attrs) {
              const attrName = this._propToAttrsMap[propName];
              const attrValue = attrs[propName](propValue);
              if (attrValue == null) {
                this.removeAttribute(attrName);
              } else {
                this.setAttribute(attrName, attrValue);
              }
            }
            this.triggerUpdate();
          }
        });

        return observedAttrs;
      }, []);
    }

    static get attrs() {
      return this.props;
    }

    static get props() {
      return Object.keys(this.prototype).reduce((o, k) => {
        o[k] = v => v;
        return o;
      }, {});
    }

    get props(): {} {
      return this._props;
    }

    set props(props: {}) {
      this._props = props;
    }

    get renderRoot() {
      return super.renderRoot || shadow(this);
    }

    get state(): {} {
      return this._state;
    }

    set state(state: {}) {
      this._state = state;
      this._triggerUpdate();
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
        this._triggerUpdate();
      }
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (this.childrenUpdated) {
        observe(this, this.childrenUpdated.bind(this));
      }

      this._triggerUpdate();
    }

    renderer(root, html) {
      if (super.renderer) {
        super.renderer(root, html);
      } else {
        root.innerHTML = html();
      }
    }

    shouldUpdate(props: {}, state: {}): boolean {
      return true;
    }

    _triggerUpdate(): void {
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
  };
}

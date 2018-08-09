import { CustomElement, CustomElementConstructor } from './types';

function delay(fn) {
  if (typeof Promise === 'function') {
    Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

export const withUpdate = (Base: CustomElementConstructor): CustomElementConstructor =>
  class extends Base {
    ['constructor']: CustomElementConstructor;

    static _attrToPropMap: { [s: string]: string } = {};
    static props: { [s: string]: (any) => any | void } = {};

    _prevProps: { [s: string]: any } = {};
    _prevState: { [s: string]: any } = {};
    _props: { [s: string]: any } = {};
    _state: { [s: string]: any } = {};
    _updating: boolean = false;

    // This is invoked once when the element is defined. Due to this, we must
    // link props to attrs here as opposed to doing it in the constructor.
    static get observedAttributes(): Array<string> {
      return Object.keys(this.props).reduce((observedAttrs, propName) => {
        // We're opinionated about the propName -> propname (attribute)
        // convention.
        const attrName = propName.toLowerCase();

        // Don't set props from attributes if there is no handler. This also
        // means we don't need to observe them at all.
        if (this.props[propName]) {
          this._attrToPropMap[attrName] = propName;
          observedAttrs = observedAttrs.concat(attrName);
        }

        // Defines a property to ensure it triggers an update.
        Object.defineProperty(this.prototype, propName, {
          configurable: true,
          get() {
            return this._props[propName];
          },
          set(val) {
            this._props[propName] = val;
            this.triggerUpdate();
          }
        });

        return observedAttrs;
      }, []);
    }

    get props(): Object {
      return Object.keys(this.constructor.props).reduce(
        (prev: Object, curr: string) => {
          prev[curr] = this[curr];
          return prev;
        },
        {}
      );
    }

    set props(props: Object) {
      Object.keys(this.constructor.props).forEach(k => (this[k] = props[k]));
    }

    get state() {
      return this._state;
    }

    set state(state: Object) {
      this._state = state;
      this.triggerUpdate();
    }

    attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null
    ): void {
      const { _attrToPropMap, props } = this.constructor;

      if (super.attributeChangedCallback) {
        super.attributeChangedCallback(name, oldValue, newValue);
      }

      const propertyName = _attrToPropMap[name];
      const propertyFunc = props[propertyName];

      if (propertyFunc) {
        this._props[propertyName] = propertyFunc(newValue);
        this.triggerUpdate();
      }
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this.triggerUpdate();
    }

    shouldUpdate(props: Object, state: Object): boolean {
      return true;
    }

    triggerUpdate(): void {
      if (this._updating) {
        return;
      }
      this._updating = true;
      delay(() => {
        const { _prevProps, _prevState } = this;
        if (this.updated && this.shouldUpdate(_prevProps, _prevState)) {
          this.updated(_prevProps, _prevState);
        }
        this._prevProps = this.props;
        this._prevState = this.state;
        this._updating = false;
      });
    }
  };

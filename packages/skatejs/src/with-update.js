// @flow

import type { CustomElement } from './types.js';

function delay(fn) {
  if (window.Promise) {
    Promise.resolve().then(fn);
  } else {
    setTimeout(fn);
  }
}

export const withUpdate = (Base: Class<any>): Class<any> =>
  class extends Base {
    static _attrToPropMap: { [string]: string } = {};
    static props: { [string]: any } = {};

    _prevProps: { [string]: any } = {};
    _prevState: { [string]: any } = {};
    _props: { [string]: (any) => any } = {};
    _state: { [string]: any } = {};
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
        // $FlowFixMe - no idea what's up here.
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
        if (this.updating) {
          this.updating(_prevProps, _prevState);
        }
        if (this.updated && this.shouldUpdate(_prevProps, _prevState)) {
          this.updated(_prevProps, _prevState);
        }
        this._prevProps = this.props;
        this._prevState = this.state;
        this._updating = false;
      });
    }
  };

export const props = {
  any: (v: any): any => v,
  array: JSON.parse,
  boolean: Boolean,
  number: Number,
  object: JSON.parse,
  string: String
};

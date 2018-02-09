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
        const attrName = propName.toLowerCase();
        this._attrToPropMap[attrName] = propName;
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
        return observedAttrs.concat(attrName);
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

    shouldUpdate(props: Object, state: Object): Boolean {
      return true;
    }

    triggerUpdate(): void {
      if (this._updating) {
        return;
      }
      this._updating = true;
      delay(() => {
        const { _prevProps, _prevState } = this;
        this.updating(_prevProps, _prevState);
        if (this.shouldUpdate(_prevProps, _prevState)) {
          this.updated(_prevProps, _prevState);
        }
        this._prevProps = this.props;
        this._prevState = this.state;
        this._updating = false;
      });
    }

    updated(props: Obejct, state: Object): void {}
    updating(props: Object, state: Object): void {}
  };

const any = v => v;
const array = JSON.parse;
const boolean = Boolean;
const number = Number;
const object = JSON.parse;
const string = String;

export const props = {
  any,
  array,
  boolean,
  number,
  object,
  string
};

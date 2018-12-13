import define, { getName } from '@skatejs/define';
import Element from '@skatejs/element';
import { createElement } from 'react';
import { render } from 'react-dom';

export default class extends Element {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot);
  }
  renderer() {
    render(this.render(), this.renderRoot);
  }
}

export function h(name, props, ...chren) {
  if (name.prototype instanceof HTMLElement) {
    name = getName(define(name));
  }
  return createElement(name, props, ...chren);
}

const symRef = Symbol();
export function setProps(domProps, refCallback = e => {}) {
  return (
    refCallback[symRef] ||
    (refCallback[symRef] = e => {
      refCallback(e);
      if (e) {
        Object.assign(e, domProps);
      }
    })
  );
}

export declare namespace h {
  namespace JSX {
    interface Element {}
    type LibraryManagedAttributes<E, _> = E extends {
      props: infer Props;
      prototype: infer Prototype;
    }
      ? Pick<Prototype, Extract<keyof Prototype, keyof Props>>
      : _;
  }
}

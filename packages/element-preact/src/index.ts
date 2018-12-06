import define, { getName } from '@skatejs/define';
import Element from '@skatejs/element';
import { h as preactH, render } from 'preact';

const mapDom = new WeakMap();

export default class extends Element {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot, mapDom.get(this));
  }
  renderer() {
    const dom = mapDom.get(this);
    mapDom.set(this, render(this.render(), this.renderRoot, dom));
  }
}

export function h(name, props, ...chren) {
  if (name.prototype instanceof HTMLElement) {
    define(name);
    name = getName(name);
  }
  return preactH(name, props, ...chren);
}

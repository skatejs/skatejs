import define, { getName } from '@skatejs/define';
import Element from '@skatejs/element';
import * as React from 'react';
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
    define(name);
    name = getName(name);
  }
  return React.createElement(name, props, ...chren);
}

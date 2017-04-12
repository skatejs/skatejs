import { h, render as preactRender } from 'preact';

import { HTMLElement, sym } from './util';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';

const _preactDom = sym('_preactDom');

function render (vnode, root) {
  const dom = preactRender(vnode, root, this[_preactDom]);
  if (!this[_preactDom]) {
    this[_preactDom] = dom;
  }
}

export const withComponent = (Base = HTMLElement) => class extends withUnique(withRender(withProps(Base))) {
  rendererCallback (shadowRoot, renderCallback) {
    render.call(this, renderCallback(), shadowRoot);
  }
};

export const Component = withComponent();
export { h };

import { h, render } from 'preact';

import { HTMLElement, sym } from './util';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';

const _preactDom = sym('_preactDom');

export const withComponent = (Base = HTMLElement) => class extends withUnique(withRender(withProps(Base))) {
  rendererCallback (shadowRoot, renderCallback) {
    this[_preactDom] = render(renderCallback(), shadowRoot, this[_preactDom]);
  }
};

export const Component = withComponent();
export { h };

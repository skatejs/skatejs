import { h, render } from 'preact';

import { HTMLElement } from './util';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';

export const withComponent = (Base = HTMLElement) => class extends withUnique(withRender(withProps(Base))) {
  propsChangedCallback (next, prev) {
    super.propsChangedCallback(next, prev);
    this.rendererCallback(render);
  }
};

export const Component = withComponent();
export { h };

import { render } from 'preact';
import { HTMLElement } from './util';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';

export function withComponent (Base = HTMLElement) {
  return class extends withUnique(withRender(withProps(Base))) {
    propsChangedCallback (next, prev) {
      super.propsChangedCallback(next, prev);
      this.rendererCallback(render);
    }
  };
}

export const Component = withComponent();
export { h } from 'preact';

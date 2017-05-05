// @flow

// $FlowFixMe - Preact doesn't have flow types.
import { h, render } from 'preact';
import { HTMLElement, Node, sym } from './util';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';

const _preactDom = sym('_preactDom');

export const withComponent = (Base?: Class<HTMLElement>): Class<HTMLElement> =>
  class extends withUnique(withRender(withProps(Base || HTMLElement))) {
    rendererCallback (shadowRoot: Node, renderCallback: Function) {
      this[_preactDom] = render(renderCallback(), shadowRoot, this[_preactDom]);
    }
  };

export const Component: HTMLElement = withComponent();
export { h };

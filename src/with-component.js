// @flow

// $FlowFixMe - Preact doesn't have flow types.
import { h, render } from 'preact';

import { HTMLElement, Node } from './util';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';

export const withComponent = (Base?: Class<HTMLElement>): Class<HTMLElement> =>
  class extends withUnique(withRender(withProps(Base || HTMLElement))) {
    rendererCallback (shadowRoot: Node, renderCallback: Function) {
      render(renderCallback(), shadowRoot);
    }
  };

export const Component: HTMLElement = withComponent();
export { h };

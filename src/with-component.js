// @flow

import { h, render } from 'preact';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';

export const withComponent = (Base?: Class<any> = HTMLElement): Class<HTMLElement> =>
  class extends withRender(withUnique(withProps(Base))) {
    _preactDom: Object;
    rendererCallback (shadowRoot: Node, renderCallback: () => Object) {
      this._preactDom = render(renderCallback(), shadowRoot, this._preactDom);
    }
  };

export const Component: Class<HTMLElement> = withComponent(typeof window === 'undefined' ? class {} : HTMLElement);
export { h };

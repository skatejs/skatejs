// @flow

import { h, render, options } from 'preact';
import { withProps } from './with-props';
import { withRender } from './with-render';
import { withUnique } from './with-unique';
import { isDefined } from './define';

let oldVnodeHook = options.vnode;
options.vnode = (vnode) => {
  if (oldVnodeHook) oldVnodeHook(vnode);
  vnode.skipChildren =
    typeof vnode.nodeName === 'string' &&
    vnode.nodeName.indexOf('-') > 0 &&
    isDefined(vnode.nodeName);
};

export const withComponent = (Base?: Class<any> = HTMLElement): Class<HTMLElement> =>
  class extends withRender(withUnique(withProps(Base))) {
    _preactDom: Object;
    rendererCallback (shadowRoot: Node, renderCallback: () => Object) {
      this._preactDom = render(renderCallback(), shadowRoot, this._preactDom || shadowRoot.children[0]);
    }
  };

export const Component: Class<HTMLElement> = withComponent(typeof window === 'undefined' ? class {} : HTMLElement);
export { h };

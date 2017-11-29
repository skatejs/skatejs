/** @jsx h */

import { h, render } from 'preact';

export default (Base = HTMLElement) =>
  class extends Base {
    get props() {
      // We override props so that we can satisfy most use
      // cases for children by using a slot.
      return {
        ...super.props,
        ...{ children: <slot /> }
      };
    }
    rendererCallback(renderRoot, renderCallback) {
      this._preactDom = render(
        renderCallback(),
        renderRoot,
        this._preactDom || renderRoot.children[0]
      );
    }
  };

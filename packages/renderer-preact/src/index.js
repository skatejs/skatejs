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
    renderer(root, call) {
      this._renderRoot = root;
      this._preactDom = render(
        call(),
        root,
        this._preactDom || root.childNodes[0]
      );
    }
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      // Preact hack https://github.com/developit/preact/issues/53
      const Nothing = () => null;
      this._preactDom = render(<Nothing />, this._renderRoot, this._preactDom);
    }
  };

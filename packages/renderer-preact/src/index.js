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
      // Render null to unmount. See https://github.com/skatejs/skatejs/pull/1432#discussion_r183381359
      this._preactDom = render(null, this._renderRoot, this._preactDom);
      this._renderRoot = null;
    }
  };

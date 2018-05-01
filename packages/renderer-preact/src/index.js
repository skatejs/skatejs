/** @jsx h */

import { define } from 'skatejs';
import { h, render } from 'preact';

let oldVnode;

function setupPreact() {
  oldVnode = preact.options.vnode;
  preact.options.vnode = vnode => {
    const fn = vnode.nodeName;
    if (fn.is) {
      vnode.nodeName = fn.is;
    } else if (fn.constructor instanceof HTMLElement) {
      fn = define(fn);
      vnode.nodeName = fn.is;
    }
  };
}

function teardownPreact() {
  preact.options.vnode = oldVnode;
}

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
      setupPreact();
      this._renderRoot = root;
      this._preactDom = render(
        call(),
        root,
        this._preactDom || root.childNodes[0]
      );
      teardownPreact();
    }
    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      // Render null to unmount. See https://github.com/skatejs/skatejs/pull/1432#discussion_r183381359
      this._preactDom = render(null, this._renderRoot, this._preactDom);
      this._renderRoot = null;
    }
  };

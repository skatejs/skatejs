/** @jsx h */

import { name } from 'skatejs';
import preact, { h, render } from 'preact';

// TODO make this a Symbol() when it's supported.
const preactNodeName = '__preactNodeName';

let oldVnode;

function newVnode(vnode) {
  let fn = vnode.nodeName;
  if (fn && fn.prototype instanceof HTMLElement) {
    if (!fn[preactNodeName]) {
      const prefix = fn.name;
      customElements.define(
        (fn[preactNodeName] = name(prefix)),
        class extends fn {}
      );
    }
    vnode.nodeName = fn[preactNodeName];
  }
  return vnode;
}

function setupPreact() {
  oldVnode = preact.options.vnode;
  preact.options.vnode = newVnode;
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

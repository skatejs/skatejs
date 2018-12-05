import Component from '@skatejs/component';
import define from '@skatejs/define';
import { options, render } from 'preact';

const mapDom = new WeakMap();
let oldVnode;

function newVnode(vnode) {
  const { nodeName } = vnode;
  if (nodeName.prototype instanceof HTMLElement) {
    vnode.nodeName = define(nodeName).is;
  }
  return vnode;
}

function setupPreact() {
  oldVnode = options.vnode;
  options.vnode = newVnode;
}

function teardownPreact() {
  options.vnode = oldVnode;
}

export default class extends Component {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot, mapDom.get(this));
  }
  renderer() {
    const dom = mapDom.get(this);
    setupPreact();
    mapDom.set(this, render(this.render(), this.renderRoot, dom));
    teardownPreact();
  }
}

export { h } from 'preact';

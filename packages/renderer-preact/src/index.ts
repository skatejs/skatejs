import { options, render } from 'preact';

const mapDom = new WeakMap();
const mapNodeName = new WeakMap();
let oldVnode;

function generateUniqueName(prefix) {
  let suffix = 0;
  while (customElements.get(`${prefix}-${suffix}`)) ++suffix;
  return `${prefix}-${suffix}`;
}

function newVnode(vnode) {
  let fn = vnode.nodeName;
  if (fn && fn.prototype instanceof HTMLElement) {
    let nodeName = mapNodeName.get(fn);
    if (!nodeName) {
      nodeName = generateUniqueName(fn.name.toLowerCase());
      mapNodeName.set(fn, nodeName);
      customElements.define(nodeName, class extends fn {});
    }
    vnode.nodeName = nodeName;
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

export default function(root, func) {
  const dom = mapDom.get(root);
  setupPreact();
  mapDom.set(root, render(func(), root, dom || root.childNodes[0]));
  teardownPreact();
}

export { h } from 'preact';

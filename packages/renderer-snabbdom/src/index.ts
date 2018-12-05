import { CustomElement } from '@skatejs/component';
import { init } from 'snabbdom';
import vnode from 'snabbdom/vnode';

export default function createMixin(modules) {
  var patch = init(modules);
  return (elem: CustomElement) => {
    const root = elem.renderRoot;
    this._renderRoot = root;
    let newVTree = elem.render();
    newVTree = vnode(
      root.nodeName,
      {},
      elem.isConnected ? (Array.isArray(newVTree) ? newVTree : [newVTree]) : [],
      undefined,
      root as HTMLElement
    );
    if (!this._vTree) {
      // small cheat to allow rendering root el
      // creates an empty vnode with the same sel as the rendered vtree
      // this ensure the view element will be properly patched
      const emptyVTree = vnode(
        root.nodeName,
        {},
        [],
        undefined,
        root as HTMLElement
      );
      patch(emptyVTree, newVTree);
    } else {
      patch(this._vTree, newVTree);
    }
    this._vTree = newVTree;
  };
}

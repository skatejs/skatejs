import { init } from 'snabbdom';
import vnode from 'snabbdom/vnode';

export default function createMixin(modules) {
  var patch = init(modules);
  return (Base = HTMLElement) =>
    class extends Base {
      get props() {
        // We override props so that we can satisfy most use
        // cases for children by using a slot.
        return {
          ...super.props,
          ...{ children: vnode('slot', {}, [], undefined, undefined) }
        };
      }
      renderer(root, call) {
        this._renderRoot = root;
        let newVTree = call();
        newVTree = vnode(
          'root',
          {},
          Array.isArray(newVTree) ? newVTree : [newVTree],
          undefined,
          root
        );
        if (!this._vTree) {
          // small cheat to allow rendering root el
          // creates an empty vnode with the same sel as the rendered vtree
          // this ensure the view element will be properly patched
          const emptyVTree = vnode('root', {}, [], undefined, root);
          patch(emptyVTree, newVTree);
        } else {
          patch(this._vTree, newVTree);
        }
        this._vTree = newVTree;
      }
      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();
        const emptyVTree = vnode('root', {}, [], undefined, this._renderRoot);
        patch(this._vTree, emptyVTree);
      }
    };
}

import Component from '@skatejs/component';
import { init } from 'snabbdom';
import vnode from 'snabbdom/vnode';

export default function(modules) {
  var patch = init(modules);
  return class extends Component {
    private _vTree;

    disconnectedCallback() {
      const root = this.renderRoot as HTMLElement;
      super.disconnectedCallback && super.disconnectedCallback();
      const emptyVTree = vnode('root', {}, [], undefined, root);
      patch(this._vTree, emptyVTree);
    }

    renderer() {
      const root = this.renderRoot as HTMLElement;
      let newVTree = this.render();
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
  };
}

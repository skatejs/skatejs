import { init } from 'snabbdom';
import vnode from 'snabbdom/vnode';

export default function createMixin(modules) {
  var patch = init(modules);
  return (Base = HTMLElement) =>
    class extends Base {
      _lastVTree = null;

      renderer(root, call) {
        this._renderRoot = root;
        let newVTree = call();

        if (!this._lastVTree) {
          const container = document.createElement('div');
          container.style = 'display: contents';
          root.appendChild(container);
          this._lastVTree = patch(root.children[0], newVTree);
        } else {
          this._lastVTree = patch(this._lastVTree, newVTree);
        }
      }

      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();
        patch(this._lastVTree, null);
      }
    };
}

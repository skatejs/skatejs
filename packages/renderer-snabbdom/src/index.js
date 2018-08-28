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

        // first render
        if (!this._lastVTree) {
          this._lastVTree = patch(root, newVTree);
        }

        // all subsequent renders
        else {
          this._lastVTree = patch(this._lastVTree, newVTree)
        }
      }
      
      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();
        patch(this._lastVTree, null)
      }
    };
}

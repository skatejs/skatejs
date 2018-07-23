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
          const tmp = document.createElement('tmp');
          this.root.appendChild(tmp);
          
          // replaces the `tmp` element with content described by the vnode
          this._lastVTree = patch(tmp, newVTree);
        }

        // all subsequent renders
        else {
          this._lastVTree = patch(this._lastVTree, newVTree)
        }
      }
      
      disconnectedCallback() {
        super.disconnectedCallback && super.disconnectedCallback();

        // How to "unmount" the component?
        // Waiting for a reply at https://github.com/snabbdom/snabbdom/issues/386
        
      }
    };
}

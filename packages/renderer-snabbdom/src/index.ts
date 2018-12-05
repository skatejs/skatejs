import Component from '@skatejs/component';
import { init } from 'snabbdom';
import vnode from 'snabbdom/vnode';

export default class Renderer extends Component {
  static modules = [];

  private _patch: Function;
  private _vTree;

  constructor() {
    super();
    this._patch = init(Renderer.modules);
  }

  disconnectedCallback() {
    const root = this.renderRoot as HTMLElement;
    super.disconnectedCallback && super.disconnectedCallback();
    const emptyVTree = vnode('root', {}, [], undefined, root);
    this._patch(this._vTree, emptyVTree);
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
      this._patch(emptyVTree, newVTree);
    } else {
      this._patch(this._vTree, newVTree);
    }
    this._vTree = newVTree;
  }
}

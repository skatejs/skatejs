import Element from '@skatejs/element';
import { bind } from 'hyperhtml';

const cache = new WeakMap();

export default class extends Element {
  renderer() {
    let h = cache.get(this);
    if (!h) cache.set(this, (h = bind(this.renderRoot)));
    this.render(h);
  }
}

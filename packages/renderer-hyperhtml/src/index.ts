import Component from '@skatejs/component';
import { bind } from 'hyperhtml';

const cache = new WeakMap();

export default class extends Component {
  renderer() {
    let html = cache.get(this);
    if (!html) cache.set(this, (html = bind(this.renderRoot)));
    this.render(html);
  }
}

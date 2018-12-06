import Element from '@skatejs/element';
import { render } from 'react-dom';

export default class extends Element {
  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    render(null, this.renderRoot);
  }
  renderer() {
    render(this.render(), this.renderRoot);
  }
}

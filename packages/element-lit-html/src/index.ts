import Element from '@skatejs/element';
import { render } from 'lit-html';

export default class extends Element {
  renderer() {
    return render(this.render(), this.renderRoot);
  }
}

export { html as h } from 'lit-html';

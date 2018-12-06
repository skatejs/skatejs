import Element from '@skatejs/element-lit-html';
import { html } from 'lit-html';

class ElementLitHtml extends Element {
  static props = {
    name: String
  };
  name = 'World';
  render() {
    return html`Hello, ${this.name}!`;
  }
}

customElements.define('element-lit-html', ElementLitHtml);

import Component from '@skatejs/component';
import renderer from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';

class RendererLitHtml extends Component {
  static props = {
    name: String
  };
  name = 'World';
  renderer = renderer;
  render() {
    return html`Hello, ${this.name}!`;
  }
}

customElements.define('renderer-lithtml', RendererLitHtml);

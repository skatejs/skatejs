import Component from 'skatejs';
import renderer from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';

class RendererLitHtml extends Component {
  name: string = 'World';
  renderer = renderer;
  render() {
    return html`Hello, ${this.name}!`;
  }
}

customElements.define('renderer-lithtml', RendererLitHtml);

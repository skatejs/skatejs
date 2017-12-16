import { props, withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';

class WithLitHtml extends withComponent(withLitHtml()) {
  static get props() {
    return {
      name: props.string
    };
  }
  render({ name }) {
    return html`Hello, ${name}!`;
  }
}

customElements.define('with-lit-html', WithLitHtml);

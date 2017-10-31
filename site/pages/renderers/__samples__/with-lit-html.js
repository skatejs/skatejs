import { props, withComponent } from '../../../../src';
import withLitHtml from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';

// This is currently required to patch some recent API changes prior to the 5.x
// release and will be fixed soon.
import { Component } from '../../../utils';

class WithLitHtml extends withComponent(withLitHtml(Component)) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return html`Hello, ${name}!`;
  }
}

customElements.define('with-lit-html', WithLitHtml);

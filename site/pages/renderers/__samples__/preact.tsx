/** @jsx h */

import Component from '@skatejs/component';
import renderer, { h } from '@skatejs/renderer-preact';

class RendererPreact extends Component {
  static props = {
    name: String
  };
  name = 'World';
  renderer = renderer;
  render() {
    return <span>Hello, {this.name}!</span>;
  }
}

customElements.define('renderer-preact', RendererPreact);

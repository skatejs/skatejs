/** @jsx h */

import Component from 'skatejs';
import renderer, { h } from '@skatejs/renderer-preact';

class RendererPreact extends Component {
  static props = {
    name: String
  };
  renderer = renderer;
  name: string = 'World';
  render() {
    return <span>Hello, {this.name}!</span>;
  }
}

customElements.define('renderer-preact', RendererPreact);

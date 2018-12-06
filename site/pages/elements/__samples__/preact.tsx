/** @jsx h */

import Element from '@skatejs/element';
import renderer, { h } from '@skatejs/element-preact';

class ElementPreact extends Element {
  static props = {
    name: String
  };
  name = 'World';
  render() {
    return <span>Hello, {this.name}!</span>;
  }
}

customElements.define('element-preact', ElementPreact);

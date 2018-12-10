/** @jsx h */

import Element, { h } from '@skatejs/element-preact';

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

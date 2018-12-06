/** @jsx React.createElement */

import Element from '@skatejs/element';
import React from 'react';

class ElementReact extends Element {
  static props = {
    name: String
  };
  name = 'World';
  render() {
    return <span>Hello, {this.name}!</span>;
  }
}

customElements.define('element-react', ElementReact);

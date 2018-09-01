/** @jsx React.createElement */

import Component from '@skatejs/core';
import renderer from '@skatejs/renderer-react';
import React from 'react';

class RendererReact extends Component {
  static props = {
    name: String
  };
  name = 'World';
  renderer = renderer;
  render() {
    return <span>Hello, {this.name}!</span>;
  }
}

customElements.define('renderer-react', RendererReact);

/* @jsx React.createElement */

import Component from 'skatejs';
import renderer from '@skatejs/renderer-react';
import React from 'react';

class RendererReact extends Component {
  name: string = 'World';
  renderer = renderer;
  render() {
    // @ts-ignore
    return <span>Hello, {this.name}!</span>;
  }
}

customElements.define('renderer-react', RendererReact);

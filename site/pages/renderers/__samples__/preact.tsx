/* @jsx h */

import { Component } from 'skatejs';
import renderer from '@skatejs/renderer-preact';
import { h } from 'preact';

class RendererPreact extends Component {
  renderer = renderer;
  name: string = 'World';
  render() {
    // @ts-ignore
    return <span>Hello, {this.name}!</span>;
  }
}

customElements.define('renderer-preact', RendererPreact);

import { props, withComponent } from '../../../src';
import withReact from '@skatejs/renderer-react/umd';
import React from 'react';

class WithReact extends withComponent(withReact()) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return <span>Hello, {name}!</span>;
  }
}

customElements.define('with-react', WithReact);

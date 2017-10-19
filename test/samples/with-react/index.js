import { props, withComponent } from 'skatejs';
import withReact from '@skatejs/renderer-react/umd';
import React from 'react';

class WithReact extends withComponent(withReact()) {
  static props = {
    name: props.string
  };
  render() {
    return <span>Hello, {name}!</span>;
  }
}

customElements.define('with-react', WithReact);

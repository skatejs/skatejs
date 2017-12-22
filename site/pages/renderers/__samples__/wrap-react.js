// @jsx React.createElement

import { props, withComponent } from 'skatejs';
import { wrap } from '@skatejs/renderer-react';
import React from 'react';

class HelloReact extends React.Component {
  render() {
    return <span>Hello, {this.props.name}!</span>;
  }
}

class WrapReact extends withComponent(wrap(HelloReact)) {
  static get props() {
    return {
      name: props.string
    };
  }
}

customElements.define('wrap-react', WrapReact);

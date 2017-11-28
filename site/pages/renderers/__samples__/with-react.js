/** @jsx React.createElement */

import { props, withComponent } from 'skatejs';
import withReact from '@skatejs/renderer-react';
import React from 'react';

// This is currently required to patch some recent API changes prior to the 5.x
// release and will be fixed soon.
import { Component } from '../../../utils';

class WithReact extends withComponent(withReact(Component)) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return <span>Hello, {name}!</span>;
  }
}

customElements.define('with-react', WithReact);

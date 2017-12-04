// @jsx h

import { props, withComponent } from 'skatejs';
import withPreact from '@skatejs/renderer-preact';
import { h } from 'preact';

class WithPreact extends withComponent(withPreact()) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return <span>Hello, {name}!</span>;
  }
}

customElements.define('with-preact', WithPreact);

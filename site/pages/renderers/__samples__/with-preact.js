/** @jsx h */

import { props, withComponent } from '../../../../src';
import withPreact from '@skatejs/renderer-preact';
import { h } from 'preact';

// This is currently required to patch some recent API changes prior to the 5.x
// release and will be fixed soon.
import { Component } from '../../../utils';

class WithPreact extends withComponent(withPreact(Component)) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return <span>Hello, {name}!</span>;
  }
}

customElements.define('with-preact', WithPreact);

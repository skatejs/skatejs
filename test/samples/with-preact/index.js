/** @jsx h */

import { props, withComponent } from '../../../src';
import withRenderer from '@skatejs/renderer-preact';
import { h } from 'preact';

const Component = withComponent(withRenderer());

customElements.define('hello-withpreact', class MyPreactHello extends Component {
  static props = {
    name: props.string
  }
  renderCallback ({ name }) {
    return <span>Hello, {name}!</span>;
  }
});

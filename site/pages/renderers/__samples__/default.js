import { props, withComponent } from 'skatejs';

class WithDefault extends withComponent() {
  static props = {
    name: props.string
  };
  render({ name }) {
    return `Hello, ${name}!`;
  }
}

customElements.define('with-default', WithDefault);

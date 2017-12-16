import { props, withComponent } from 'skatejs';

class WithDefault extends withComponent() {
  static get props() {
    return {
      name: props.string
    };
  }
  render({ name }) {
    return `Hello, ${name}!`;
  }
}

customElements.define('with-default', WithDefault);

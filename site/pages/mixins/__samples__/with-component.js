import { props, withComponent } from 'skatejs';

class WithComponent extends withComponent() {
  static props = {
    name: props.string
  };
  render({ name }) {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('with-component', WithComponent);

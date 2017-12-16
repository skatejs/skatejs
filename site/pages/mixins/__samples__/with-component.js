import { props, withComponent } from 'skatejs';

class WithComponent extends withComponent() {
  static get props() {
    return {
      name: props.string
    };
  }
  render({ name }) {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('with-component', WithComponent);

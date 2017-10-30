import { props, withComponent } from '../../../../src';

const myRenderer = (Base = HTMLElement) =>
  class extends Base {
    renderer(root, render) {
      root.innerHTML = render();
    }
  };

class WithComponent extends withComponent(myRenderer()) {
  static props = {
    name: props.string
  };
  render({ name }) {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('with-component', WithComponent);

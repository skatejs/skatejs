import { props, withComponent } from '../../../src';

const myRenderer = (Base = HTMLElement) =>
  class extends Base {
    rendererCallback(renderRoot, renderCallback) {
      renderRoot.innerHTML = renderCallback();
    }
  };

class WithComponent extends withComponent(myRenderer()) {
  static props = {
    name: props.string
  };

  renderCallback({ name }) {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('with-component', WithComponent);

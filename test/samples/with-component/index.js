import { props, withComponent } from '../../..';

class Hello extends withComponent() {
  static props = {
    name: props.string
  };
  rendererCallback(renderRoot) {
    renderRoot.innerHTML = `Hello, ${this.name}!`;
  }
}

customElements.define('x-hello', Hello);

import { withRenderer } from 'skatejs';

const myRenderer = (Base = HTMLElement) =>
  class extends Base {
    renderer(root, render) {
      root.innerHTML = render();
    }
  };

class WithRenderer extends withRenderer(myRenderer()) {
  static observedAttributes = ['name'];
  attributeChangedCallback() {
    this.updated();
  }
  render() {
    return `Hello, ${this.getAttribute('name')}!`;
  }
}

customElements.define('with-renderer', WithRenderer);

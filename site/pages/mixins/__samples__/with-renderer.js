import { withRenderer } from 'skatejs';

class WithRenderer extends withRenderer() {
  static observedAttributes = ['name'];
  attributeChangedCallback() {
    this.updated();
  }
  render() {
    return `Hello, ${this.getAttribute('name')}!`;
  }
}

customElements.define('with-renderer', WithRenderer);

import { withRenderer } from '../../../src';

const myRenderer = (Base = HTMLElement) =>
  class extends Base {
    renderer(renderRoot, render) {
      renderRoot.innerHTML = render();
    }
  };

class WithRenderer extends withRenderer(myRenderer()) {
  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  get name() {
    return this._myProp;
  }

  set name(value) {
    this._myProp = value;
    this.triggerUpdate();
  }

  render({ name }) {
    return `Hello, ${this.name}!`;
  }
}

customElements.define('with-renderer', WithRenderer);

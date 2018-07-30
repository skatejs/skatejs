global.CustomElement = window.CustomElement = class CustomElement extends HTMLElement {
  constructor() {
    super();
    this.connectedCallback = jest.fn();
    this.disconnectedCallback = jest.fn();
  }
};
window.customElements.define('custom-element', CustomElement);

import { withUnique } from '../../../../src';

const names = [];

class Base extends withUnique() {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <p>The generated names were:</p>
      <ul>${names.map(name => `<li>${name}</li>`).join('')}</ul>
    `;
  }
}

// We define these in closures to show how it generates the custom element name
// from the name of the class.

(function() {
  class WithUnique extends Base {}
  names.push(WithUnique.is);
  customElements.define(WithUnique.is, WithUnique);
})();

(function() {
  class WithUnique extends Base {}
  names.push(WithUnique.is);
  customElements.define(WithUnique.is, WithUnique);
})();

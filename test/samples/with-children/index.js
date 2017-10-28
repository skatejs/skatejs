import { withChildren } from '../../../src';

class WithChildren extends withChildren() {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  // This is called when the element is first connected and whenever children
  // are updated. It uses a mutation observer internally, so this will only be
  // called on the next microtask after updating happens.
  childrenDidUpdate() {
    const len = this.children.length;
    this.shadowRoot.innerHTML = `This element has ${len} ${len === 1
      ? 'child'
      : 'children'}!`;
  }
}

customElements.define('with-children', WithChildren);

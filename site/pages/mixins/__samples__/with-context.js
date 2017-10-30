import { withContext } from '../../../../src';

class WithContext extends withContext() {
  context = {
    background: 'white',
    color: 'black',
    margin: '10px 0',
    padding: '10px'
  };
  connectedCallback() {
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <slot></slot>
      <with-context-descendant>
        ...and shadow DOM!
      </with-context-descendant>
    `;
  }
}

class WithContextDescendant extends withContext() {
  connectedCallback() {
    const { background, color, margin, padding } = this.context;
    this.attachShadow({ mode: 'open' }).innerHTML = `
      <style>
        :host {
          background: ${background};
          color: ${color};
          display: block;
          margin: ${margin};
          padding: ${padding};
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('with-context', WithContext);
customElements.define('with-context-descendant', WithContextDescendant);

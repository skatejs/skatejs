import { withState } from '../../../src';

class WithState extends withState() {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }
  connectedCallback() {
    this.state = { name: 'You' };
  }
  triggerUpdate() {
    this.shadowRoot.innerHTML = `Hey, ${this.state.name}!`;
  }
}

customElements.define('with-state', WithState);

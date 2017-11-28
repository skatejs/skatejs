import { withLifecycle } from 'skatejs';

class Base extends HTMLElement {
  connectedCallback() {
    this._isConnected = true;
  }
}

class WithLifecycle extends withLifecycle(Base) {
  connecting() {
    this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';
  }
  connected() {
    this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';
  }
}

customElements.define('with-lifecycle', WithLifecycle);

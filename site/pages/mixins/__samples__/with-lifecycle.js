import { withLifecycle } from '../../../../src';

class Base extends HTMLElement {
  connectedCallback() {
    this._isConnected = true;
  }
}

class WithLifecycle extends withLifecycle(Base) {
  willMount() {
    this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';
  }
  didMount() {
    this.innerHTML += this._isConnected ? 'ray!' : 'Hoo';
  }
}

customElements.define('with-lifecycle', WithLifecycle);

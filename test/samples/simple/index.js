import { withComponent } from '../../../src';

class MyComponent extends withComponent() {
  renderer(renderRoot, render) {
    renderRoot.innerHTML = render();
  }
  render() {
    return 'Hello, <slot></slot>!';
  }
}

customElements.define('hello-simple', MyComponent);

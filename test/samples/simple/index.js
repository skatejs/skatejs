import { withComponent } from '../../..';

class MyComponent extends withComponent() {
  rendererCallback(renderRoot, renderCallback) {
    renderRoot.innerHTML = renderCallback();
  }
  renderCallback() {
    return 'Hello, <slot></slot>!';
  }
}

customElements.define('hello-simple', MyComponent);

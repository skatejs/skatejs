import { withComponent, Renderer, define } from '../..';

const withRenderer = () =>
  class extends HTMLElement implements Renderer<Element> {
    renderer(shadowRoot: HTMLElement, render: () => Element): void {
      shadowRoot.innerHTML = '';
      shadowRoot.appendChild(render());
    }
  };

const Component = withComponent(withRenderer());

class MyComponent extends Component {
  renderCallback() {
    let el = document.createElement('div');
    el.innerHTML = 'Hello, <slot></slot>!';
    return el;
  }
}

define(MyComponent);

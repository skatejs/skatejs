/** @jsx h */

import { Component, h } from 'preact';
import withRenderer from '..';

class MyElement extends withRenderer() {
  renderCallback({ name }) {
    return <div>Hello, {name}!</div>;
  }
}
customElements.define('my-element', MyElement);

test('renders', () => {
  function testContent(text) {
    return `<div>Hello, ${text}!</div>`;
  }

  const el = new MyElement();
  expect(el.innerHTML).toEqual('');
  el.rendererCallback(el, el.renderCallback.bind(el, { name: 'World' }));
  expect(el.innerHTML).toEqual(testContent('World'));
  el.rendererCallback(el, el.renderCallback.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toEqual(testContent('Bob'));
});

test('wrappers', () => {
  class PreactComponent extends Component {
    render() {
      return <div>Hello, {this.props.children}!</div>;
    }
  }

  class PreactComponentWrapper extends withRenderer() {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    renderCallback() {
      return <PreactComponent {...this.props} />;
    }
  }

  customElements.define('preact-component-wrapper', PreactComponentWrapper);

  const el = new PreactComponentWrapper();
  const { shadowRoot } = el;
  el.rendererCallback(shadowRoot, el.renderCallback.bind(el));
  expect(shadowRoot.innerHTML).toEqual('<div>Hello, <slot></slot>!</div>');
});

import React, { Component } from 'react';
import withRenderer from '..';

class MyElement extends withRenderer() {
  renderCallback({ name }) {
    return <div>Hello, {name}!</div>;
  }
}
customElements.define('my-element', MyElement);

test('renders', () => {
  function testContent(text) {
    return `<div data-reactroot=\"\"><!-- react-text: 2 -->Hello, <!-- /react-text --><!-- react-text: 3 -->${
      text
    }<!-- /react-text --><!-- react-text: 4 -->!<!-- /react-text --></div>`;
  }

  const el = new MyElement();
  expect(el.innerHTML).toEqual('');
  el.rendererCallback(el, el.renderCallback.bind(el, { name: 'World' }));
  expect(el.innerHTML).toEqual(testContent('World'));
  el.rendererCallback(el, el.renderCallback.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toEqual(testContent('Bob'));
});

test('wrappers', () => {
  class ReactComponent extends Component {
    render() {
      return <div>Hello, {this.props.children}!</div>;
    }
  }

  class ReactComponentWrapper extends withRenderer() {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    renderCallback() {
      return <ReactComponent {...this.props} />;
    }
  }

  customElements.define('react-component-wrapper', ReactComponentWrapper);

  const el = new ReactComponentWrapper();
  const { shadowRoot } = el;
  el.rendererCallback(shadowRoot, el.renderCallback.bind(el));
  expect(shadowRoot.innerHTML).toEqual(
    '<div data-reactroot=""><!-- react-text: 2 -->Hello, <!-- /react-text --><slot></slot><!-- react-text: 4 -->!<!-- /react-text --></div>'
  );
});

/** @jsx h */

import { Component, h } from 'preact';
import { define } from 'skatejs';
import withRenderer from '..';

const WebComponent = withRenderer(HTMLElement);

@define
class MyElement extends WebComponent {
  render({ name }) {
    return <div>Hello, {name}!</div>;
  }
}

test('renders', () => {
  function testContent(text) {
    return `<div>Hello, ${text}!</div>`;
  }

  const el = new MyElement();
  expect(el.innerHTML).toEqual('');
  el.renderer(el, el.render.bind(el, { name: 'World' }));
  expect(el.innerHTML).toEqual(testContent('World'));
  el.renderer(el, el.render.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toEqual(testContent('Bob'));
});

test('wrappers', () => {
  class PreactComponent extends Component {
    render() {
      return <div>Hello, {this.props.children}!</div>;
    }
  }

  @define
  class PreactComponentWrapper extends WebComponent {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
    render() {
      return <PreactComponent {...this.props} />;
    }
  }

  const el = new PreactComponentWrapper();
  const { shadowRoot } = el;
  el.renderer(shadowRoot, el.render.bind(el));
  expect(shadowRoot.innerHTML).toEqual('<div>Hello, <slot></slot>!</div>');
});

import React, { Component } from 'react';
import { define } from 'skatejs';
import withRenderer, { asCustomElement } from '..';

function render(Comp) {
  const el = new Comp();
  el.renderer(el, el.render.bind(el));
  return el;
}

class ReactComponent extends Component {
  render() {
    return <div>Hello, {this.props.children}!</div>;
  }
}

test('renders', () => {
  @define
  class MyElement extends withRenderer() {
    render({ name }) {
      return <div>Hello, {name}!</div>;
    }
  }

  const el = new MyElement();
  expect(el.innerHTML).toMatchSnapshot();
  el.renderer(el, el.render.bind(el, { name: 'World' }));
  expect(el.innerHTML).toMatchSnapshot();
  el.renderer(el, el.render.bind(el, { name: 'Bob' }));
  expect(el.innerHTML).toMatchSnapshot();
});

test('wrapper - static component', () => {
  const ReactComponentWrapper = asCustomElement(ReactComponent);

  define(ReactComponentWrapper);
  const el = render(ReactComponentWrapper);
  expect(el.innerHTML).toMatchSnapshot();
});

test('wrapper - override render()', () => {
  @define
  class ReactComponentWrapper extends asCustomElement(ReactComponent) {
    render() {
      return <ReactComponent {...this.props} />;
    }
  }

  const el = new ReactComponentWrapper();
  el.renderer(el, el.render.bind(el));
  expect(el.innerHTML).toMatchSnapshot();
});

/** @jsx React.createElement */

import React, { Component } from 'react';
import { define } from 'skatejs';
import withRenderer, { wrap } from '..';

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

test('wrapper - override render()', () => {
  @define
  class ReactComponentWrapper extends withRenderer() {
    render() {
      return <ReactComponent {...this.props} />;
    }
  }

  const el = new ReactComponentWrapper();
  el.renderer(el, el.render.bind(el));
  expect(el.innerHTML).toMatchSnapshot();
});

test('wrapper - static component', () => {
  const ReactComponentWrapper = wrap(ReactComponent);

  define(ReactComponentWrapper);
  const el = render(ReactComponentWrapper);
  expect(el.innerHTML).toMatchSnapshot();
});

test('unmounts', () => {
  const container = document.createElement('div');

  const mockMount = jest.fn();
  const mockUnmount = jest.fn();

  class MockReactComponent extends Component {
    componentDidMount = mockMount;
    componentWillUnmount = mockUnmount;
    render() {
      return <div />;
    }
  }

  const ReactComponentWrapper = wrap(MockReactComponent);
  define(ReactComponentWrapper);

  expect(mockMount).toHaveBeenCalledTimes(0);
  expect(mockUnmount).toHaveBeenCalledTimes(0);

  const el = new ReactComponentWrapper();
  container.appendChild(el);

  expect(mockMount).toHaveBeenCalledTimes(0);
  expect(mockUnmount).toHaveBeenCalledTimes(0);

  el.renderer(el, el.render.bind(el));

  expect(el.innerHTML).toMatchSnapshot();
  expect(mockMount).toHaveBeenCalledTimes(1);
  expect(mockUnmount).toHaveBeenCalledTimes(0);

  container.removeChild(el);

  expect(el.firstChild).toBeNull();
  expect(mockMount).toHaveBeenCalledTimes(1);
  expect(mockUnmount).toHaveBeenCalledTimes(1);
});

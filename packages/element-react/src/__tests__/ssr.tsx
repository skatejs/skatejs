import * as React from 'react';
import { renderToString } from 'react-dom/server';
import Element, { h } from '..';

class Hello extends Element {
  render() {
    return (
      <span>
        Hello, <slot />!
      </span>
    );
  }
}

const App = () => (
  <div>
    <Hello>World</Hello>
  </div>
);

test('ssr', () => {
  expect(renderToString(<App />)).toBe(
    '<div><span>Hello, <slot></slot>!</span></div>'
  );
});

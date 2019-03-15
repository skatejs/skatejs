/** @jsx h */
/** @jest-environment node */

import { renderToString } from 'react-dom/server';
import Element, { h } from '..';
import { Fragment } from 'react';
import { hydrate } from 'react-dom';

// We want to ensure this gets SSR'd correctly, and its slot content
// projection is simulated.
class Hello extends Element {
  render() {
    return (
      <Fragment>
        Hello, <slot />
        <slot name="punctuation">.</slot>
      </Fragment>
    );
  }
}

// We create inner React components to test slot projection.
const Exclaim = props => <span {...props}>!</span>;
const World = props => <span {...props}>World</span>;

const App = () => (
  <Hello>
    <World />
    <Exclaim slot="punctuation" />
  </Hello>
);

test('renderToString', () => {
  const oldWindow = global['window'];
  global['window'] = undefined;
  expect(renderToString(<App />)).toBe(
    '<x-hello data-reactroot="">Hello, <slot><span>World</span></slot><slot name="punctuation"><span slot="punctuation">!</span></slot></x-hello>'
  );
  global['window'] = oldWindow;
});

test('hydrate', () => {
  document.body.innerHTML = `<div id="app">${renderToString(<App />)}</div>`;
  hydrate(<App />, document.getElementById('app'));
  expect(document.body.innerHTML).toBe(
    '<div id="app"><x-hello data-reactroot=""><span>World</span><span slot="punctuation">!</span></x-hello></div>'
  );
});

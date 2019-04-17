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
      <Shadow>
        Hello, <slot />
        <slot name="punctuation">.</slot>
      </Shadow>
    );
  }
}

class Shadow extends HTMLElement {
  get parentElement() {
    return this.parentNode as HTMLElement;
  }
  get parentElementRoot() {
    const { parentElement } = this;
    return parentElement ? parentElement.shadowRoot : null;
  }
  get childNodes() {
    // @ts-ignore
    if (!super.childNodes) {
      // @ts-ignore
      super.childNodes = [];
    }
    const root = this.parentElementRoot;
    // @ts-ignore
    return root ? root.childNodes : super.childNodes;
  }
  get children() {
    const root = this.parentElementRoot;
    // @ts-ignore
    return root ? root.children : super.children;
  }
  get innerHTML() {
    const root = this.parentElementRoot;
    // @ts-ignore
    return root ? root.innerHTML : super.innerHTML;
  }
  set innerHTML(html) {
    const root = this.parentElementRoot;
    if (root) {
      root.innerHTML = html;
    } else {
      // @ts-ignore
      super.innerHTML = html;
    }
  }
  get textContent() {
    const root = this.parentElementRoot;
    // @ts-ignore
    return root ? root.textContent : super.textContent;
  }
  set textContent(text) {
    const root = this.parentElementRoot;
    if (root) {
      root.textContent = text;
    } else {
      // @ts-ignore
      super.textContent = text;
    }
  }
  appendChild<T extends Node>(node: T): T {
    const root = this.parentElementRoot;
    return root ? root.appendChild(node) : super.appendChild(node);
  }
  insertBefore<T extends Node>(node: T, referenceNode: Node): T {
    const root = this.parentElementRoot;
    return root
      ? root.insertBefore(node, referenceNode)
      : super.insertBefore(node, referenceNode);
  }
  removeChild<T extends Node>(node: T): T {
    const root = this.parentElementRoot;
    return root ? root.removeChild(node) : super.removeChild(node);
  }
  replaceChild<T extends Node>(node: Node, referenceNode: T): T {
    const root = this.parentElementRoot;
    return root
      ? root.replaceChild(node, referenceNode)
      : super.replaceChild(node, referenceNode);
  }
  connectedCallback() {
    const { parentElement } = this;
    if (parentElement && !parentElement.shadowRoot) {
      parentElement.attachShadow({ mode: 'open' });
      while (super.hasChildNodes()) {
        // @ts-ignore
        parentElement.shadowRoot.appendChild(super.firstChild);
      }
    }
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

function nodeRenderToString(comp) {
  const oldWindow = global['window'];
  global['window'] = undefined;
  const str = renderToString(comp);
  global['window'] = oldWindow;
  return str;
}

test('renderToString', () => {
  expect(nodeRenderToString(<App />)).toBe(
    '<x-hello data-reactroot=""><x-shadow data-reactroot="">Hello, <slot><span>World</span></slot><slot name="punctuation"><span slot="punctuation">!</span></slot></x-shadow></x-hello>'
  );
});

test('hydrate', () => {
  document.body.innerHTML = `<div id="app">${nodeRenderToString(
    <App />
  )}</div>`;
  hydrate(<App />, document.getElementById('app'));
  expect(document.body.innerHTML).toBe(
    '<div id="app"><x-hello data-reactroot=""><span>World</span><span slot="punctuation">!</span></x-hello></div>'
  );
});

/** @jsx h */
/** @jest-environment node */

import Shadow from "@skatejs/sk-shadow";
import { renderToString } from "react-dom/server";
import Element, { h } from "..";
import { hydrate } from "react-dom";

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

// We create inner React components to test slot projection.
const Exclaim = (props: { [s: string]: any }) => <span {...props}>!</span>;
const World = (props: { [s: string]: any }) => <span {...props}>World</span>;

const App = () => (
  <Hello>
    <World />
    <Exclaim slot="punctuation" />
  </Hello>
);

function nodeRenderToString(comp: React.ReactElement) {
  const oldWindow = global["window"];
  global["window"] = undefined;
  const str = renderToString(comp);
  global["window"] = oldWindow;
  return str;
}

test("renderToString", () => {
  expect(nodeRenderToString(<App />)).toBe(
    '<x-hello data-reactroot=""><x-shadow data-reactroot="">Hello, <slot><span>World</span></slot><slot name="punctuation"><span slot="punctuation">!</span></slot></x-shadow></x-hello>'
  );
});

test("hydrate", () => {
  document.body.innerHTML = `<div id="app">${nodeRenderToString(
    <App />
  )}</div>`;

  // Currently this is expected to generate a warning as hydration invokes the
  // custom element lifecycle which attaches shadow roots and does not do any
  // sort of simulation for transforming to a string.
  hydrate(<App />, document.getElementById("app"));

  expect(document.body.innerHTML).toBe(
    '<div id="app"><x-hello data-reactroot=""><span>World</span><span slot="punctuation">!</span></x-hello></div>'
  );
});

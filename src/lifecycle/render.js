import { IncrementalDOM } from '../api/vdom';

const { patch } = IncrementalDOM;
const symbolShadowRoot = '____shadow_root';

export default function (opts) {
  const internalRenderer = opts.render;
  return function (elem) {
    if (!internalRenderer) {
      return;
    }

    let shadowRoot;

    if (!elem[symbolShadowRoot]) {
      if (elem.attachShadow) {
        shadowRoot = elem.attachShadow({ mode: 'open' });
      } else {
        shadowRoot = elem.createShadowRoot();
      }
      elem[symbolShadowRoot] = shadowRoot;
    }

    patch(elem[symbolShadowRoot], internalRenderer, elem);
  };
}

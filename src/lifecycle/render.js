import { IncrementalDOM } from '../api/vdom';

const { patch } = IncrementalDOM;
const symbolShadowRoot = '____shadow_root';

export default function (opts) {
  const internalRenderer = opts.render;
  return function (elem) {
    if (!internalRenderer) {
      return;
    }

    if (!elem[symbolShadowRoot]) {
      let shadowRoot;
      if (elem.attachShadow) {
        shadowRoot = elem.attachShadow({ mode: 'open' });
      } else if (elem.createShadowRoot) {
        shadowRoot = elem.createShadowRoot();
      } else {
        shadowRoot = elem.shadowRoot = elem;
      }
      elem[symbolShadowRoot] = shadowRoot;
    }

    patch(elem[symbolShadowRoot], internalRenderer, elem);
  };
}

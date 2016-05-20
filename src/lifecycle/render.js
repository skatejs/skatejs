import { IncrementalDOM } from '../api/vdom';
import { shadowRoot } from '../api/symbols';

const { patch } = IncrementalDOM;

export default function (opts) {
  const internalRenderer = opts.render;
  return function (elem) {
    if (!internalRenderer) {
      return;
    }

    if (!elem[shadowRoot]) {
      let sr;
      if (elem.attachShadow) {
        sr = elem.attachShadow({ mode: 'open' });
      } else if (elem.createShadowRoot) {
        sr = elem.createShadowRoot();
      } else {
        sr = elem;
      }
      elem[shadowRoot] = sr;
    }

    patch(elem[shadowRoot], internalRenderer, elem);
  };
}

import { IncrementalDOM } from '../api/vdom';

const { patch } = IncrementalDOM;

export default function (opts) {
  const internalRenderer = opts.render;
  return function (elem) {
    if (!internalRenderer) {
      return;
    }

    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }

    patch(elem.shadowRoot, internalRenderer, elem);
  };
}

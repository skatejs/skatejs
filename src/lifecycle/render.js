import { IncrementalDOM } from '../api/vdom';

const { patch } = IncrementalDOM;

export default function (opts) {
  const internalRenderer = opts.render;

  if (!internalRenderer) {
    return;
  }

  return function (elem) {
    if (!elem.shadowRoot) {
      elem.attachShadow({ mode: 'open' });
    }
    patch(elem.shadowRoot, internalRenderer, elem);
  };
}

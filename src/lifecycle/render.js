import { IncrementalDOM } from '../api/vdom';
import { shadowRoot } from '../api/symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';

const { patchInner } = IncrementalDOM;

export default function (Ctor) {
  const { render } = Ctor;

  return function (elem) {
    if (!render) {
      return;
    }

    if (!elem[shadowRoot]) {
      let sr;

      if (shadowDomV1) {
        sr = elem.attachShadow({ mode: 'open' });
      } else if (shadowDomV0) {
        sr = elem.createShadowRoot();
      } else {
        sr = elem;
      }

      elem[shadowRoot] = sr;
    }

    patchInner(elem[shadowRoot], render, elem);
  };
}

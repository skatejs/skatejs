import { patchInner } from 'incremental-dom';
import { connected as $connected, props as $props, rendering as $rendering, shadowRoot as $shadowRoot } from '../util/symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';
import props from '../api/props';

export default function (Ctor) {
  const { afterRender, beforeRender, render } = Ctor;

  return function (elem) {
    // We don't render if:
    // - There is no render()
    // - We are currently in the process of rendering
    // - The element is not in the DOM yet
    if (!render || elem[$rendering] || !elem[$connected]) {
      return;
    }

    // Flag as rendering. This prevents anything from trying to render - or
    // queueing a render - while there is a pending render.
    elem[$rendering] = true;

    // Try and get the current shadow root (will be setup if not).
    let sr = elem[$shadowRoot];

    // Setup the shadow root if it hasn't been setup yet.
    if (!sr) {
      if (shadowDomV1) {
        sr = elem.attachShadow({ mode: 'open' });
      } else if (shadowDomV0) {
        sr = elem.createShadowRoot();
      } else {
        sr = elem;
      }

      elem[$shadowRoot] = sr;
    }

    let shouldRender = true;
    if (beforeRender) {
      const prev = elem[$props];
      const next = props(elem);
      elem[$props] = next;
      shouldRender = beforeRender(elem, prev, next);
    }

    if (shouldRender) {
      patchInner(sr, render, elem);
      if (afterRender) {
        afterRender(elem);
      }
    }

    elem[$rendering] = false;
  };
}

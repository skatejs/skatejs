import { patchInner } from 'incremental-dom';
import {
  connected as $connected,
  props as $props,
  rendering as $rendering,
  shadowRoot as $shadowRoot,
} from '../util/symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';
import props from '../api/props';

export default function (Ctor) {
  const { render, rendered, updated } = Ctor;

  return (elem) => {
    if (elem[$rendering] || !elem[$connected]) {
      return;
    }

    // Flag as rendering. This prevents anything from trying to render - or
    // queueing a render - while there is a pending render.
    elem[$rendering] = true;

    // Call the updated() callback to see if we should render.
    let shouldRender = true;
    if (updated) {
      const prev = elem[$props];
      elem[$props] = props(elem);
      shouldRender = updated(elem, prev);
    }

    // Even though this would ideally be checked in the updated() callback,
    // it may not be, so we ensure that there is a point in proceeding.
    if (!render) {
      elem[$rendering] = false;
      return;
    }

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

    if (shouldRender) {
      patchInner(sr, () => {
        const possibleFn = render(elem);
        if (typeof possibleFn === 'function') {
          possibleFn();
        } else if (Array.isArray(possibleFn)) {
          possibleFn.forEach((fn) => {
            if (typeof fn === 'function') {
              fn();
            }
          });
        }
      });

      if (rendered) {
        rendered(elem);
      }
    }

    elem[$rendering] = false;
  };
}

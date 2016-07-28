import { patchInner } from 'incremental-dom';
import { connected as $connected, shadowRoot as $shadowRoot, state as $state } from '../util/symbols';
import { shadowDomV0, shadowDomV1 } from '../util/support';
import state from '../api/state';

export default function (Ctor) {
  const { beforeRender, render } = Ctor;

  return function (elem) {
    // We don't render at all if the user hasn't specified a render function or
    // if the element hasn't been connected yet. This saves us from doing
    // unnecessary renders.
    if (!render || !elem[$connected]) {
      return;
    }

    let sr = elem[$shadowRoot];

    if (beforeRender) {
      const prevState = elem[$state];
      const currState = state(elem);

      // Update the previous state no matter what so it can be compared on the
      // next render, even if the component doesn't render this time around.
      elem[$state] = currState;

      // We always do the initial render, therefore we only check if we should
      // render if there is a shadow root. If there is no shadow root, then we
      // are in the initial render.
      if (sr) {
        beforeRender(elem, prevState, currState, patchInner.bind(null, sr, render, elem));
        return;
      }
    }

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

    patchInner(sr, render, elem);
  };
}

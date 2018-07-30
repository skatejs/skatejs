// @flow

import { shadow } from './shadow.js';

export const withRenderer = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    _shadowRoot: Node;

    get renderRoot() {
      return super.renderRoot || shadow(this);
    }

    // $FlowFixMe - says ShadowRoot isn't an interface (but it is).
    renderer(root: ShadowRoot, html: () => string) {
      if (super.renderer) {
        super.renderer(root, html);
      } else {
        root.innerHTML = html() || '';
      }
    }

    updated(...args) {
      super.updated && super.updated(...args);
      this.rendering && this.rendering();
      // $FlowFixMe - don't know how to get ShadowRoot working.
      this.renderer(this.renderRoot, () => this.render && this.render(this));
      this.rendered && this.rendered();
    }
  };

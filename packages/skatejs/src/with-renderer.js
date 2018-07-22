// @flow

import { shadow } from './shadow.js';

export const withRenderer = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    _shadowRoot: Node;

    get renderRoot() {
      return super.renderRoot || shadow(this);
    }

    renderer(root, html) {
      if (super.renderer) {
        super.renderer(root, html);
      } else {
        root.innerHTML = html() || '';
      }
    }

    updated(prevProps, prevState) {
      super.updated && super.updated(prevProps, prevState);
      this.rendering && this.rendering();
      this.renderer(this.renderRoot, () => this.render && this.render(this));
      this.rendered && this.rendered();
    }
  };

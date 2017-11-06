// @flow

import { shadow } from './shadow.js';

export const withRenderer = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    _shadowRoot: Node;

    get renderRoot() {
      return shadow(this);
    }

    updated(...args) {
      if (super.updated) {
        super.updated(...args);
      }
      if (this.renderer) {
        if (this.rendering) {
          this.rendering();
        }
        this.renderer(this.renderRoot, () => this.render && this.render(this));
        if (this.rendered) {
          this.rendered();
        }
      }
    }
  };

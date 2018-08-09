import { shadow } from './shadow.js';
import { CustomElementConstructor } from './types';

export const withRenderer = (Base: CustomElementConstructor): CustomElementConstructor =>
  class extends Base {
    get renderRoot() {
      return super.renderRoot || shadow(this);
    }

    renderer(root, html) {
      if (super.renderer) {
        super.renderer(root, html);
      } else {
        root.innerHTML = html();
      }
    }

    updated(props, state) {
      this.renderer(this.renderRoot, () => this.render(this));
      if (super.updated) {
        super.updated(props, state);
      }
    }
  };

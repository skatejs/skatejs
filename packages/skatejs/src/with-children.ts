import { CustomElementConstructor } from './types';

export const withChildren = (Base: CustomElementConstructor): CustomElementConstructor =>
  class extends Base {
    childrenUpdated: Function | void;

    connectedCallback() {
      if (typeof super.connectedCallback === 'function') {
        super.connectedCallback();
      }
      if (this.childrenUpdated) {
        const fn = this.childrenUpdated.bind(this);
        const mo = new MutationObserver(fn);
        mo.observe(this, { childList: true });
        document.addEventListener('DOMContentLoaded', fn);
      }
    }
  };

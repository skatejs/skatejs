// @flow

import type { WithChildren } from './types';

export const withChildren = (
  Base: Class<any> = HTMLElement
): Class<WithChildren> =>
  class extends Base {
    childrenDidUpdate: Function | void;

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      if (this.childrenDidUpdate) {
        const fn = this.childrenDidUpdate.bind(this);
        const mo = new MutationObserver(fn);
        mo.observe(this, { childList: true });
        fn();
      }
    }
  };

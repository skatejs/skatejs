// @flow

export const withChildren = (Base: Class<any>): Class<any> =>
  class extends Base {
    childrenUpdated: Function | void;

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      if (this.childrenUpdated) {
        const fn = this.childrenUpdated.bind(this);
        fn();
        const mo = new MutationObserver(fn);
        mo.observe(this, { childList: true });
      }
    }
  };

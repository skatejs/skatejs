// @flow

export const withChildren = (
  Base: Class<HTMLElement> = HTMLElement
): Class<HTMLElement> =>
  class extends Base {
    childrenChangedCallback: Function | void;

    connectedCallback() {
      if (super.connectedCallback) {
        // $FlowFixMe
        super.connectedCallback();
      }
      if (this.childrenChangedCallback) {
        const ccc = this.childrenChangedCallback.bind(this);
        const mo = new MutationObserver(ccc);
        mo.observe(this, { childList: true });
        ccc();
      }
    }
  };

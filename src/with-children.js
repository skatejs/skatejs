// @flow

export const withChildren = (
  Base: Class<HTMLElement> = HTMLElement
): Class<HTMLElement> =>
  class extends Base {
    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (this.childrenChangedCallback) {
        const mo = new MutationObserver(() => this.childrenChangedCallback());
        mo.observe(this, { childList: true });
        this.childrenChangedCallback();
      }
    }
  };

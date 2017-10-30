// @flow

export const withLifecycle = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    connectedCallback() {
      if (this.willMount) {
        this.willMount();
      }
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (this.didMount) {
        this.didMount();
      }
    }
    disconnectedCallback() {
      if (this.willUnmount) {
        this.willUnmount();
      }
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (this.didUnmount) {
        this.didUnmount();
      }
    }
  };

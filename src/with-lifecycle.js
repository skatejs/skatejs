// @flow

export const withLifecycle = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    connectedCallback() {
      if (this.connecting) {
        this.connecting();
      }
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      if (this.connected) {
        this.connected();
      }
    }
    disconnectedCallback() {
      if (this.disconnecting) {
        this.disconnecting();
      }
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }
      if (this.disconnected) {
        this.disconnected();
      }
    }
  };

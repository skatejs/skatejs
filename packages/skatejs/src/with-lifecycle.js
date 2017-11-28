// @flow

export const withLifecycle = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    connected() {}
    connecting() {}
    disconnected() {}
    disconnecting() {}
    connectedCallback() {
      this.connecting();
      super.connectedCallback && super.connectedCallback();
      this.connected();
    }
    disconnectedCallback() {
      this.disconnecting();
      super.disconnectedCallback && super.disconnectedCallback();
      this.disconnected();
    }
  };

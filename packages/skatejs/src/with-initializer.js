// @flow

export const withInitializer = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    static get observedAttributes() {
      super.observedAttributes && super.observedAttributes();
      this.initializeCallback();
    }
    static initializeCallback() {
      super.initializeCallback && super.initializeCallback();
    }
  };

// @flow

export const withInitializer = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    static get observedAttributes() {
      let observed = super.observedAttributes;
      this.initializeCallback();
      return observed;
    }
    static initializeCallback() {
      super.initializeCallback && super.initializeCallback();
    }
  };

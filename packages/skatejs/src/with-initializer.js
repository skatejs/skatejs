// @flow

export const withInitializer = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    constructor() {
      super();
      this.initializeCallback();
    }
    initializeCallback() {
      super.initializeCallback && super.initializeCallback();
    }
  };

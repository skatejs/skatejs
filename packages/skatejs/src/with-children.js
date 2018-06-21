// @flow

export const withChildren = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    childrenUpdated: Function | void;

    // We automatically set a prop called children to invoke an update if it's
    // been defined.
    childrenUpdated() {
      super.childrenUpdated && super.childrenUpdated();
      if (this.props && this.props.hasOwnProperty('children')) {
        this.props = { children: this.children };
      }
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      if (this.childrenUpdated) {
        const fn = this.childrenUpdated.bind(this);
        this._mo = new MutationObserver(fn);
        this._mo.observe(this, { childList: true });
        fn();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback && super.disconnectedCallback();
      if (this._mo) {
        this._mo.disconnect();
      }
    }
  };

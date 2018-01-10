export const withChildren = (Base = HTMLElement) => {
  return class extends Base {
    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      if (this.childrenUpdated) {
        const fn = this.childrenUpdated.bind(this);
        fn();
        const mo = new MutationObserver(fn);
        mo.observe(this, { childList: true });

        // We automatically set a prop called children to invoke an update if
        // it's been defined.
        if (this.props && this.props.hasOwnProperty('children')) {
          this.props = { children: this.children };
        }
      }
    }
  };
};

// @flow

const attachShadowOptions = { mode: 'open' };

function attachShadow(elem) {
  return elem.attachShadow ? elem.attachShadow(attachShadowOptions) : elem;
}

export const withRenderer = (
  Base: Class<HTMLElement> = HTMLElement
): Class<HTMLElement> =>
  class extends Base {
    _connected: boolean;
    _shadowRoot: Node;

    renderCallback: Function | void;
    renderedCallback: Function | void;
    rendererCallback: Function | void;

    get renderRoot() {
      return (
        this._shadowRoot ||
        (this._shadowRoot = this.shadowRoot || attachShadow(this))
      );
    }

    connectedCallback() {
      super.connectedCallback && super.connectedCallback();
      this._connected = true;
    }

    componentUpdatedCallback() {
      super.componentUpdatedCallback && super.componentUpdatedCallback();
      if (!this._connected) return;
      this.rendererCallback &&
        this.rendererCallback(
          this.renderRoot,
          () => this.renderCallback && this.renderCallback(this)
        );
      this.renderedCallback && this.renderedCallback();
    }
  };

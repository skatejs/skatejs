// @flow

const attachShadowOptions = { mode: 'open' };

function attachShadow(elem) {
  return elem.attachShadow ? elem.attachShadow(attachShadowOptions) : elem;
}

export const withRenderer = (Base: Class<any> = HTMLElement): Class<any> =>
  class extends Base {
    _connected: boolean;
    _shadowRoot: Node;

    get renderRoot() {
      return (
        this._shadowRoot ||
        (this._shadowRoot = this.shadowRoot || attachShadow(this))
      );
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }
      this._connected = true;
    }

    didUpdate(...args) {
      if (super.didUpdate) {
        super.didUpdate(...args);
      }
      if (!this._connected) {
        return;
      }
      if (this.renderer) {
        if (this.willRender) {
          this.willRender();
        }
        this.renderer(this.renderRoot, () => this.render && this.render(this));
        if (this.didRender) {
          this.didRender();
        }
      }
    }
  };

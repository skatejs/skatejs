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
      if (super.connectedCallback) {
        // $FlowFixMe - not in HTMLElement.
        super.connectedCallback();
      }
      this._connected = true;
    }

    propsChangedCallback() {
      if (super.propsChangedCallback) {
        // $FlowFixMe - not in HTMLElement.
        super.propsChangedCallback();
      }
      if (!this._connected) {
        return;
      }
      if (this.rendererCallback) {
        this.rendererCallback(
          this.renderRoot,
          () => this.renderCallback && this.renderCallback(this)
        );
      }
      if (this.renderedCallback) {
        this.renderedCallback();
      }
    }
  };

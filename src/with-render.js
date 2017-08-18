// @flow

const attachShadowOptions = { mode: "open" };

function attachShadow(elem) {
  return elem.attachShadow ? elem.attachShadow(attachShadowOptions) : elem;
}

export const withRender = (
  Base: Class<HTMLElement> = HTMLElement
): Class<HTMLElement> =>
  class extends Base {
    _shadowRoot: Node;
    renderCallback: Function | void;
    renderedCallback: Function | void;
    rendererCallback: Function | void;

    get renderRoot() {
      this._shadowRoot =
        this._shadowRoot ||
        (this._shadowRoot = this.shadowRoot || attachShadow(this));
      return this._shadowRoot;
    }

    propsChangedCallback() {
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

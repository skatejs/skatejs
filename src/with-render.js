// @flow

const attachShadowOptions = { mode: 'open' };

function attachShadow (elem) {
  return elem.attachShadow ? elem.attachShadow(attachShadowOptions) : elem;
}

export const withRender = (Base: Class<HTMLElement>): Class<HTMLElement> =>
  class extends (Base || HTMLElement) {
    _shadowRoot: Node;

    get renderRoot () {
      this._shadowRoot = this._shadowRoot || (this._shadowRoot = (this.shadowRoot || attachShadow(this)));
      return this._shadowRoot;
    }

    propsChangedCallback () {
      this.rendererCallback(this.renderRoot, () => this.renderCallback(this));
      this.renderedCallback();
    }

    renderCallback () {}
    renderedCallback () {}
    rendererCallback () {}
  };

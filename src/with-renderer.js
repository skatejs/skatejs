// @flow

import type { WithRenderer } from './types';

const attachShadowOptions = { mode: 'open' };

function attachShadow(elem) {
  return elem.attachShadow ? elem.attachShadow(attachShadowOptions) : elem;
}

export const withRenderer = (
  Base: Class<any> = HTMLElement
): Class<WithRenderer> =>
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
      super.connectedCallback && super.connectedCallback();
      this._connected = true;
    }

    didUpdate(...args) {
      super.didUpdate && super.didUpdate(...args);
      if (!this._connected) return;
      this.willRender && this.willRender();
      this.renderer &&
        this.renderer(this.renderRoot, () => this.render && this.render(this));
      this.didRender && this.didRender();
    }
  };

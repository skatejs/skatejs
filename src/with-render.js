// @flow

import { HTMLElement, sym } from './util';

const _shadowRoot = sym();

const attachShadowOptions = { mode: 'open' };

function attachShadow (elem) {
  return elem.attachShadow ? elem.attachShadow(attachShadowOptions) : elem;
}

export const withRender = (Base?: Class<HTMLElement>): Class<HTMLElement> =>
  class extends (Base || HTMLElement) {
    get renderRoot () {
      this[_shadowRoot] = this[_shadowRoot] || (this[_shadowRoot] = (this.shadowRoot || attachShadow(this)));
      return this[_shadowRoot];
    }

    propsChangedCallback () {
      this.rendererCallback(this.renderRoot, () => this.renderCallback(this));
      this.renderedCallback();
    }

    // Called to render the component.
    renderCallback () {}

    // Called after the component has rendered.
    renderedCallback () {}
  };

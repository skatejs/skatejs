import { HTMLElement } from './util';

export const withRender = (Base = HTMLElement) => class extends Base {
  propsUpdatedCallback (next, prev) {
    super.propsUpdatedCallback(next, prev);
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }
    this.rendererCallback(this.shadowRoot, () => this.renderCallback(this));
    this.renderedCallback();
  }

  // Called to render the component.
  renderCallback () {}

  // Called after the component has rendered.
  renderedCallback () {}
};

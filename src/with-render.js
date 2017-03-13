import { withProps } from './with-props';

export function withRender (Base = withProps()) {
  return class extends Base {
    propsChangedCallback () {
      super.propsChangedCallback();

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }

      this.rendererCallback(this.shadowRoot, this.renderCallback(this));
      this.renderedCallback();
    }

    // Called to render the component.
    renderCallback () {}

    // Called after the component has rendered.
    renderedCallback () {}

    // Called to render the component.
    rendererCallback () {}
  };
}

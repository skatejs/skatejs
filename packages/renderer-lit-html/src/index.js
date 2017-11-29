import { render } from 'lit-html/lib/lit-extended';

export default (Base = HTMLElement) =>
  class extends Base {
    rendererCallback(renderRoot, renderCallback) {
      render(renderCallback(), renderRoot);
    }
  };

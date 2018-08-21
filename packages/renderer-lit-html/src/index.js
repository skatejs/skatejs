import { render } from 'lit-html';

export default (Base = HTMLElement) =>
  class extends Base {
    renderer(root, call) {
      render(call(), root);
    }
  };

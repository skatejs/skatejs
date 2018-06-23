import { render } from 'lit-html/lib/lit-extended';

export default (Base = class extends HTMLElement {}) =>
  class extends Base {
    renderer(root, call) {
      render(call(), root);
    }
  };

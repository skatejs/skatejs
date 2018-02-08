import { bind } from 'hyperhtml';

export default Base =>
  class extends Base {
    renderer(root, call) {
      this.hyper = this.hyper || bind(root);
      call();
    }
  };

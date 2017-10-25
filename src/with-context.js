import { sym } from './util/index';

const _context = sym('context');

export const withContext = (Base = HTMLElement) =>
  class extends Base {
    get context() {
      if (this[_context]) {
        return this[_context];
      }
      let node = this;
      while ((node = node.parentNode || node.host)) {
        if ('context' in node) {
          return node.context;
        }
      }
    }
    set context(context) {
      this[_context] = context;
    }
  };

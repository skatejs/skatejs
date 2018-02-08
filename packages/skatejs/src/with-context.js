// @flow

export const withContext = (Base: Class<any>): Class<any> =>
  class extends Base {
    get context(): Object {
      if (this._context) {
        return this._context;
      }
      let node = this;
      while ((node = node.parentNode || node.host)) {
        if ('context' in node) {
          return node.context;
        }
      }
      return {};
    }
    set context(context: Object): void {
      this._context = context;
    }
  };

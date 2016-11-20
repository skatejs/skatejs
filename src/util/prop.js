import assign from './assign';

/*
 * Returns a native property definition based on the given options
 */
export default opts => {
  opts = assign({
    configurable: true,
    enumerable: true,
    writable: !(opts.get || opts.set)
  }, opts);
  if ('writable' in opts && (opts.get || opts.set)) {
    // Note: if get or set is present then it cannot be writable
    delete opts.writable;
  }
  if (opts.override) {
    opts.set = function set (value) {
      Object.defineProperty(this, opts.override, {
        value,
        writable: true
      });
    };
  }
  return opts;
};

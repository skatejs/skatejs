import assign from './assign';

export default opts => {
  opts = assign({
    configurable: true,
    enumerable: true,
    writable: !(opts.get || opts.set)
  }, opts);
  if ('writable' in opts && (opts.get || opts.set)) {
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

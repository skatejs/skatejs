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
  return opts;
};

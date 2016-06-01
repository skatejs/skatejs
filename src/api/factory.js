import define from './define';

export default function (opts) {
  return function (name) {
    return define(name, opts);
  };
}

import skate from './skate';

export default function (opts) {
  return function (name) {
    return skate(name, opts);
  };
}

import data from '../util/data';

export default function (opts) {
  const { detached } = opts;
  return function (elem) {
    if (!detached) {
      return;
    }
    const info = data(elem);
    if (info.detached) return;
    info.detached = true;
    info.attached = false;
    detached(elem);
  };
}

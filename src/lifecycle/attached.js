import data from '../util/data';

export default function (opts) {
  const { attached } = opts;
  return function (elem) {
    if (!attached) {
      return;
    }
    const info = data(elem);
    if (info.attached) return;
    info.attached = true;
    info.detached = false;
    attached(elem);
  };
}

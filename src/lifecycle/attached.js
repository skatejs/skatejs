import data from '../util/data';

export default function (Ctor) {
  const { attached } = Ctor;
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

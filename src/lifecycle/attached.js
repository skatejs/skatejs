import data from '../util/data';

export default function (opts) {
  const { attached } = opts;
  return attached ? function () {
    const info = data(this);
    if (info.attached) return;
    info.attached = true;
    info.detached = false;
    attached(this);
  } : undefined;
}

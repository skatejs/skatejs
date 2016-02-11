import data from '../util/data';

export default function (opts) {
  const { attached } = opts;
  return attached ? function () {
    let info = data(this, `lifecycle/${opts.id}`);
    if (info.attached) return;
    info.attached = true;
    info.detached = false;
    attached(this);
  } : undefined;
}

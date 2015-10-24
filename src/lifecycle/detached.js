import data from '../util/data';

export default function (opts) {
  return function () {
    let info = data(this, `lifecycle/${opts.id}`);
    if (info.detached) return;
    info.detached = true;
    info.attached = false;
    opts.detached(this);
  };
}

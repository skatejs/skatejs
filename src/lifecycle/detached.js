import data from '../util/data';
import registry from '../global/registry';
import walkTree from '../util/walk-tree';

function callDetachedOnDescendants (elem, id) {
  walkTree(elem.childNodes, function (child) {
    registry.find(child).forEach(Ctor => Ctor.prototype.detachedCallback.call(child));
  }, function (child) {
    return !data(child, id).detached;
  });
}

export default function (opts) {
  return function () {
    let info = data(this, opts.id);
    if (info.detached) return;
    info.detached = true;
    info.attached = false;

    callDetachedOnDescendants(this, opts.id);
    opts.detached.call(this);
  };
}

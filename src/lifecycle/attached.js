import data from '../util/data';
import registry from '../global/registry';
import walkTree from '../util/walk-tree';

function callAttachedOnDescendants (elem, id) {
  walkTree(elem.childNodes, function (child) {
    registry.find(child).forEach(Ctor => Ctor.prototype.attachedCallback.call(child));
  }, function (child) {
    return !data(child, id).attached;
  });
}

export default function (opts) {
  /* jshint expr: true */
  return function () {
    var info = data(this, opts.id);
    var isNative = this.attachedCallback;

    if (info.attached) return;
    info.attached = true;
    info.detached = false;

    callAttachedOnDescendants(this, opts.id);
    opts.attached.call(this);
  };
}

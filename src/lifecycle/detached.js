import data from '../util/data';
import registry from '../polyfill/registry';
import walkTree from '../util/walk-tree';

function callDetachedOnDescendants (elem, opts) {
  walkTree(elem.childNodes, function (elem) {
    registry.getForElement(elem).forEach(Ctor => Ctor.prototype.createdCallback.call(elem));
  }, function (elem) {
    return !data(elem, opts.id).detached;
  });
}

function callDetached (elem, opts) {
  if (opts.detached) {
    opts.detached.call(elem);
  }
}

export default function (opts) {
  /* jshint expr: true */
  return function () {
    var info = data(this, opts.id);
    var isNative = this.detachedCallback;

    if (info.detached) {
      return;
    }

    isNative || callDetachedOnDescendants(this, opts);
    info.detached = true;
    callDetached(this, opts);
    info.attached = false;
  };
}

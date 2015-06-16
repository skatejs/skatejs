import data from '../util/data';
import registry from '../polyfill/registry';
import walkTree from '../util/walk-tree';

function callAttachedOnDescendants (elem, opts) {
  walkTree(elem.childNodes, function (elem) {
    registry.getForElement(elem).forEach(Ctor => Ctor.prototype.createdCallback.call(elem));
  }, function (elem) {
    return !data(elem, opts.id).attached;
  });
}

function callAttached (elem, opts) {
  if (opts.attached) {
    opts.attached.call(elem);
  }
}

export default function (opts) {
  /* jshint expr: true */
  return function () {
    var info = data(this, opts.id);
    var isNative = this.attachedCallback;

    if (info.attached) {
      return;
    }

    isNative || callAttachedOnDescendants(this, opts);
    info.attached = true;
    callAttached(this, opts);
    info.detached = false;
  };
}

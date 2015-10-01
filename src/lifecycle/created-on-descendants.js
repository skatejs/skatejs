import data from '../util/data';
import registry from '../global/registry';
import walkTree from '../util/walk-tree';

export default function createdOnDescendants (elem, opts) {
  let id = opts.id;
  walkTree(elem.childNodes, function (child) {
    registry.find(child).forEach(Ctor => Ctor.prototype.createdCallback.call(child));
  }, function (child) {
    return !data(child, id).created;
  });
}

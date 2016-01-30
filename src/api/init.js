import elementContains from '../util/element-contains';
import registry from '../shared/registry';
import walkTree from '../util/walk-tree';

export default function (...args) {
  args.forEach(function (arg) {
    const isInDom = elementContains(document, arg);
    walkTree(arg, function (descendant) {
      const component = registry.find(descendant);
      if (component && !component.isNative) {
        component.prototype.createdCallback.call(descendant);
        isInDom && component.prototype.attachedCallback.call(descendant);
      }
    });
  });
}

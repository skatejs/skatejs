import elementContains from '../util/element-contains';
import registry from '../shared/registry';
import walkTree from '../util/walk-tree';

export default function (...args) {
  args.forEach(function (arg) {
    const isInDom = elementContains(document, arg);
    walkTree(arg, function (descendant) {
      const component = registry.find(descendant);
      if (component && !component.isNative) {
        if (component.prototype.createdCallback) {
          component.prototype.createdCallback.call(descendant);
        }

        if (isInDom && component.prototype.attachedCallback) {
          isInDom && component.prototype.attachedCallback.call(descendant);
        }
      }
    });
  });
}

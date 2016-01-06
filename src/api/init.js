import elementContains from '../util/element-contains';
import registry from '../global/registry';
import walkTree from '../util/walk-tree';

export default function (...args) {
  args.forEach(function (arg) {
    const isInDom = elementContains(document, arg);
    walkTree(arg, function (descendant) {
      const components = registry.find(descendant);
      const componentsLength = components.length;

      for (let a = 0; a < componentsLength; a++) {
        components[a].prototype.createdCallback.call(descendant);
      }

      for (let a = 0; a < componentsLength; a++) {
        if (isInDom) {
          components[a].prototype.attachedCallback.call(descendant);
        }
      }
    });
  });
}

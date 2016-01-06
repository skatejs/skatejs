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
        console.log('created', components[a].id, components[a].prototype.createdCallback);
        components[a].prototype.createdCallback.call(descendant);
      }

      for (let a = 0; a < componentsLength; a++) {
        if (isInDom) {
          console.log('attached', components[a].id, components[a].prototype.attachedCallback);
          components[a].prototype.attachedCallback.call(descendant);
        }
      }
    });
  });
}

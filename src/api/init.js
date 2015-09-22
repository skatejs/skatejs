import elementContains from '../util/element-contains';
import registry from '../global/registry';
import walkTree from '../util/walk-tree';

export default function (element) {
  var isInDom = elementContains(document, element);

  walkTree(element, function (descendant) {
    var components = registry.find(descendant);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      components[a].prototype.createdCallback.call(descendant);
    }

    for (let a = 0; a < componentsLength; a++) {
      if (isInDom) {
        components[a].prototype.attachedCallback.call(descendant);
      }
    }
  });

  return element;
}

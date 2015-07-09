import attached from '../lifecycle/attached';
import created from '../lifecycle/created';
import elementContains from '../util/element-contains';
import registry from '../global/registry';
import walkTree from '../util/walk-tree';

export default function (element) {
  var isInDom = elementContains(document, element);

  walkTree(element, function (descendant) {
    var components = registry.find(descendant);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      created(components[a]).call(descendant);
    }

    for (let a = 0; a < componentsLength; a++) {
      if (isInDom) {
        attached(components[a]).call(descendant);
      }
    }
  });

  return element;
}

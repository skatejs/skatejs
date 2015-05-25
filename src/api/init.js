import attached from '../lifecycle/attached';
import created from '../lifecycle/created';
import elementContains from '../util/element-contains';
import registry from '../polyfill/registry';
import walkTree from '../util/walk-tree';

var HTMLElement = window.HTMLElement;

export default function (nodes) {
  var nodesToUse = nodes;

  if (!nodes) {
    return nodes;
  }

  if (typeof nodes === 'string') {
    nodesToUse = nodes = document.querySelectorAll(nodes);
  } else if (nodes instanceof HTMLElement) {
    nodesToUse = [nodes];
  }

  walkTree(nodesToUse, function (element) {
    var components = registry.getForElement(element);
    var componentsLength = components.length;

    for (let a = 0; a < componentsLength; a++) {
      created(components[a]).call(element);
    }

    for (let a = 0; a < componentsLength; a++) {
      if (elementContains(document, element)) {
        attached(components[a]).call(element);
      }
    }
  });

  return nodes;
}

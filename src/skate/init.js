import init from '../lifecycle/init';
import walkTree from '../utils/walk-tree';

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

  walkTree(nodesToUse, init);

  return nodes;
}

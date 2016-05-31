import elementContains from '../util/element-contains';
import findElementInRegistry from '../util/find-element-in-registry';
import support from '../native/support';
import walkTree from '../util/walk-tree';

export default function (elem) {
  if (!support.polyfilled) {
    return;
  }

  const isInDom = elementContains(document, elem);

  walkTree(elem, function (descendant) {
    const component = findElementInRegistry(descendant);

    if (component) {
      if (component.prototype.createdCallback) {
        component.prototype.createdCallback.call(descendant);
      }

      if (isInDom && component.prototype.attachedCallback) {
        isInDom && component.prototype.attachedCallback.call(descendant);
      }
    }
  });
}

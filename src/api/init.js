import { attached, created } from '../api/symbols';
import elementContains from '../util/element-contains';
import findElementInRegistry from '../util/find-element-in-registry';
import support from '../native/support';
import walkTree from '../util/walk-tree';

export default function (...args) {
  if (!support.polyfilled) {
    return;
  }

  args.forEach(function (arg) {
    const isInDom = elementContains(document, arg);
    walkTree(arg, function (descendant) {
      const component = findElementInRegistry(descendant);
      if (component) {
        component[created](descendant);
        if (isInDom) {
          component[attached](descendant);
        }
      }
    });
  });
}

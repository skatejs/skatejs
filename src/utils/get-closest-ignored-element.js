import { ATTR_IGNORE } from '../constants';

var DocumentFragment = window.DocumentFragment;

export default function (element) {
  var parent = element;

  while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
    if (parent.hasAttribute(ATTR_IGNORE)) {
      return parent;
    }

    parent = parent.parentNode;
  }
}

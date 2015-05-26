import ignored from './ignored';

var DocumentFragment = window.DocumentFragment;

export default function (element) {
  var parent = element;

  while (parent && parent !== document && !(parent instanceof DocumentFragment)) {
    if (ignored(parent)) {
      return parent;
    }

    parent = parent.parentNode;
  }
}

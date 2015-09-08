import ignored from './ignored';

let { Element } = window;

export default function (element) {
  var parent = element;
  while (parent instanceof Element) {
    if (ignored(parent)) {
      return parent;
    }
    parent = parent.parentNode;
  }
}

import ignored from './ignored';

const { Element } = window;

export default function (element) {
  let parent = element;
  while (parent instanceof Element) {
    if (ignored(parent)) {
      return parent;
    }
    parent = parent.parentNode;
  }
}

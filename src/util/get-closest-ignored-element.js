import global from './global';
import ignored from './ignored';

const { Element } = global;

export default function (element) {
  let parent = element;
  while (parent instanceof Element) {
    if (ignored(parent)) {
      return parent;
    }
    parent = parent.parentNode;
  }
}

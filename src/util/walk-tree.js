import ignored from './ignored';

const { Node } = window;

export default function walk (elem, fn) {
  if (elem.nodeType !== Node.ELEMENT_NODE || ignored(elem)) {
    return;
  }

  const chren = elem.childNodes;
  let child = chren && chren[0];

  fn(elem);
  while (child) {
    walk(child, fn);
    child = child.nextSibling;
  }
}

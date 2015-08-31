import ignored from './ignored';

var Node = window.Node;

function walk (elem, fn, filter) {
  if (elem.nodeType !== Node.ELEMENT_NODE || ignored(elem) || (filter && filter(elem) === false)) {
    return;
  }

  var chren = elem.childNodes;
  var child = chren && chren[0];

  fn(elem);
  while (child) {
    walk(child, fn, filter);
    child = child.nextSibling;
  }
}

export default function (elems, fn, filter) {
  if (!elems) {
    return;
  }

  if (elems instanceof Node) {
    elems = [elems];
  }

  for (let a = 0; a < elems.length; a++) {
    walk(elems[a], fn, filter);
  }
}

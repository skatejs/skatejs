import ignored from './ignored';

var Node = window.Node;

function walk (elem, fn) {
  if (elem.nodeType !== Node.ELEMENT_NODE || ignored(elem)) {
    return;
  }

  var chren = elem.childNodes;
  var child = chren && chren[0];

  fn(elem);
  while (child) {
    walk(child, fn);
    child = child.nextSibling;
  }
}

export default function (elems, fn) {
  if (!elems) {
    return;
  }

  if (elems instanceof Node) {
    elems = [elems];
  }

  for (let a = 0; a < elems.length; a++) {
    walk(elems[a], fn);
  }
}

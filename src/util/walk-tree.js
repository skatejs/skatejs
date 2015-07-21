import ignored from './ignored';

var Node = window.Node;

function walk (elem, fn, filter) {
  if (elem.nodeType !== 1 || ignored(elem) || (filter && filter(elem) === false)) {
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

  var elemsLen = elems.length;
  for (let a = 0; a < elemsLen; a++) {
    walk(elems[a], fn, filter);
  }
}

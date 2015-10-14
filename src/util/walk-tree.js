import ignored from './ignored';

// We don't use the global Node because we want this to be able to be included
// in a NodeJS environment.
const nodeTypeElement = 1;

function walk (elem, fn) {
  if (elem.nodeType !== nodeTypeElement || ignored(elem)) {
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

  if (elems.nodeType) {
    elems = [elems];
  }

  for (let a = 0; a < elems.length; a++) {
    walk(elems[a], fn);
  }
}

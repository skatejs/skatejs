import ignored from './ignored';

function walk (elem, fn, filter) {
  if (elem.nodeType !== 1 || ignored(elem) || (filter && filter(elem) === false)) {
    return;
  }

  var child = elem.children[0];
  while (child) {
    walk(child, fn, filter);
    child = child.nextElementSibling;
  }

  fn(elem);
}

export default function (elems, fn, filter) {
  var len = elems.length;
  for (let a = 0; a < len; a++) {
    walk(elems[a], fn, filter);
  }
}

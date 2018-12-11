import toDom from './to-dom';

function find (selector) {
  const found = document.querySelector(selector);
  if (!found) {
    throw new Error(`No mount node found for selector: ${selector}.`);
  }
  return found;
}

export default function (tree, elem = document.createElement('div')) {
  if (!elem) {
    throw new Error('No mount node provided.');
  }

  if (typeof elem === 'string') {
    elem = find(elem);
  }

  elem.innerHTML = '';
  elem.appendChild(toDom(tree));

  return elem;
}

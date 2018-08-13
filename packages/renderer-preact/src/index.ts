import { render } from 'preact';

const cache = new WeakMap();

export default function(root, func) {
  const dom = cache.get(root);
  cache.set(root, render(func(), root, dom || root.childNodes[0]));
}

import { bind } from 'hyperhtml';
import { Root } from '@skatejs/core';

const cache = new WeakMap();

export default function(root: Root, func: (Function) => Object) {
  let html = cache.get(root);
  if (!html) cache.set(root, (html = bind(root)));
  func(html);
}

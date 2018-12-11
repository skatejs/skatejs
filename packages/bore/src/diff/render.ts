import fragment from './fragment';
import merge from './merge';
import toVdom from './to-vdom';
import WeakMap from './util/weak-map';

// @ts-ignore
const targetMap = new WeakMap();

export default function(render) {
  return function(node, done) {
    const src = targetMap.get(node) || toVdom(node);
    const tar = fragment(render(node));
    merge(src, tar, { done });
    targetMap.set(node, tar);
  };
}

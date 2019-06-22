import fragment from "./fragment.js";
import merge from "./merge.js";
import toVdom from "./to-vdom.js";
import WeakMap from "./util/weak-map.js";

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

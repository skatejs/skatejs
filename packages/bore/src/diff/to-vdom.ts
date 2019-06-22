import { isElement, isFragment, isString } from "./util/is-type.js";
import fragment from "./fragment.js";
import h from "./h.js";
import nodeMap from "./util/node-map.js";
import root from "./util/root.js";
import text from "./text.js";
import WeakMap from "./util/weak-map.js";

// @ts-ignore
const { NodeFilter } = root;
const { SHOW_DOCUMENT_FRAGMENT, SHOW_ELEMENT, SHOW_TEXT } = NodeFilter;
// @ts-ignore
const vNodeMap = new WeakMap();

function getAttributes(node) {
  const temp = {};
  const { attributes } = node;
  const { length } = attributes;
  for (let a = 0; a < length; a++) {
    const { name, value } = attributes[a];
    temp[name] = value;
  }
  return temp;
}

function getFragmentFromString(str) {
  const div = document.createElement("div");
  const fra = document.createDocumentFragment();
  div.innerHTML = str;
  while (div.hasChildNodes()) {
    fra.appendChild(div.firstChild);
  }
  return fra;
}

function getVNode(node) {
  const { nodeType } = node;

  if (nodeType === 3) {
    return text(node.textContent);
  }

  // @ts-ignore
  const vNode = h(node.localName);
  vNode.attributes = getAttributes(node);
  nodeMap[vNode.__id] = node;
  vNodeMap.set(node, vNode);
  return vNode;
}

export default function(dom) {
  let vRoot;

  if (isElement(dom)) {
    vRoot = getVNode(dom);
  } else if (isFragment(dom)) {
    // @ts-ignore
    vRoot = fragment();
  } else if (isString(dom)) {
    dom = getFragmentFromString(dom);
    // @ts-ignore
    vRoot = fragment();
  }

  const walker = document.createTreeWalker(
    dom,
    SHOW_DOCUMENT_FRAGMENT | SHOW_ELEMENT | SHOW_TEXT,
    null,
    false
  );

  while (walker.nextNode()) {
    const { currentNode } = walker;
    const vNode = getVNode(currentNode);
    const vNodeParent = vNodeMap.get(currentNode.parentNode);

    if (vNodeParent) {
      vNodeParent.childNodes.push(vNode);
    } else {
      vRoot.childNodes.push(vNode);
    }
  }

  return vRoot;
}

import root from "./root.js";

// @ts-ignore
const { Node } = root;
const { ELEMENT_NODE, DOCUMENT_FRAGMENT_NODE, TEXT_NODE } = Node;

export const isNode = (e, t) => e.nodeType === t;
export const isElement = e => isNode(e, ELEMENT_NODE);
export const isFragment = e => isNode(e, DOCUMENT_FRAGMENT_NODE);
export const isText = e => isNode(e, TEXT_NODE);

export const isType = (v, t) => typeof v === t;
export const isString = v => isType(v, "string");

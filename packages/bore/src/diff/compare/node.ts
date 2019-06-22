import compareElement from "./element.js";
import compareText from "./text.js";

const NODE_ELEMENT = 1;
const NODE_TEXT = 3;

export default function(src, tar) {
  const tarType = tar.nodeType;
  const srcType = src.nodeType;

  if (tarType !== srcType) {
    return [];
  } else if (tarType === NODE_ELEMENT) {
    return compareElement(src, tar);
  } else if (tarType === NODE_TEXT) {
    return compareText(src, tar);
  }

  return [];
}

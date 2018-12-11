const nodeType = 11;
export default function (childNodes) {
  childNodes = childNodes || [];
  childNodes = Array.isArray(childNodes) ? childNodes : [childNodes];
  return { childNodes, nodeType };
}

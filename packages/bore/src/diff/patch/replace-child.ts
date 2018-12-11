import dom from '../to-dom';
import nodeMap from '../util/node-map';

export default function (src, tar) {
  const realSrc = nodeMap[src.__id];
  if (realSrc) {
    realSrc.parentNode && realSrc.parentNode.replaceChild(dom(tar), realSrc);
  } else {
    src.__id = tar.__id;
    src.nodeType = tar.nodeType;
    src.localName = tar.localName;
    src.attributes = tar.attributes;
    src.events = tar.events;
    src.childNodes = tar.childNodes;
  }
}

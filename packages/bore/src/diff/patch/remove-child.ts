import nodeMap from '../util/node-map';

export default function (src, tar) {
  const realtar = nodeMap[tar.__id];
  const realSrc = nodeMap[src.__id];

  // We don't do parentNode.removeChild because parentNode may report
  // incorrectly in some prollyfills since it's impossible (?) to spoof.
  if (realSrc) {
    realSrc.removeChild(realtar);
  } else {
    const { childNodes } = realSrc;
    const index = childNodes.indexOf(realtar);
    if (index > -1) {
      childNodes.splice(index, 1);
    }
  }
}

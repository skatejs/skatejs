export default function (proto) {
  var chains = [];
  while (proto) {
    chains.push(proto);
    proto = Object.getPrototypeOf(proto);
  }
  chains.reverse();
  return chains;
}

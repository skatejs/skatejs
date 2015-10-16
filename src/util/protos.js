export default function (proto) {
  var chains = [proto];
  /* jshint boss: true */
  while ((proto = Object.getPrototypeOf(proto))) {
    chains.push(proto);
  }
  chains.reverse();
  return chains;
}

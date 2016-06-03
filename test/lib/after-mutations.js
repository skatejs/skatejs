export default function afterMutations (...fns) {
  const fn = fns.shift();
  setTimeout(function () {
    if (typeof fn === 'function') {
      fn();
    }
    if (fns.length) {
      afterMutations.apply(null, fns);
    }
  }, 1);
}

export default function afterMutations(...fns) {
  setTimeout(function() {
    const fn = fns.shift();
    if (typeof fn === 'function') {
      fn();
    }
    if (fns.length) {
      afterMutations.apply(null, fns);
    }
  }, 1);
}

export default function (fn) {
  var called = false;

  return function (...args) {
    if (!called) {
      called = true;
      setTimeout(() => {
        called = false;
        fn.apply(this, args);
      }, 1);
    }
  };
}

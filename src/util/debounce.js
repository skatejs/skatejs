const raf = requestAnimationFrame || setTimeout;
export default function (fn) {
  var called = false;

  return function (...args) {
    if (!called) {
      called = true;
      raf(() => {
        called = false;
        fn.apply(this, args);
      });
    }
  };
}

export default function (fn) {
  return function () {
    if (document.readyState === 'complete') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  };
}

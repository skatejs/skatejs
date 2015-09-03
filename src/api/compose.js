export default function (...fns) {
  return function (arg) {
    return fns.reduce((val, fn) => {
      return typeof fn === 'function' ? fn.call(this, val) : val;
    }, arg);
  };
}

export default function (fn) {
  return function (...args) {
    return args[0].nodeType ? fn.apply(this, args) : function () {
      return fn.apply(window, [this].concat(args));
    };
  };
}

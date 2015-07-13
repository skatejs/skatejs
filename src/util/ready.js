// IE <= 10 can fire "interactive" too early (#243).
var isOldIE = !!document.attachEvent;  // attachEvent was removed in IE11.

function isReady() {
  if (isOldIE) {
    return document.readyState === 'complete';
  } else {
    return document.readyState === 'interactive' || document.readyState === 'complete';
  }
}

export default function (fn) {
  return function () {
    if (isReady()) {
      fn();
    } else {
      if (isOldIE) {
        window.addEventListener('load', fn);
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    }
  };
}

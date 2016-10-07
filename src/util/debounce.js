const longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
let timeoutDuration = 0;
for (let i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

export default function (fn) {
  let called = false;
  return (...args) => {
    if (!called) {
      called = true;
      setTimeout(() => {
        called = false;
        fn.apply(this, args);
      }, timeoutDuration);
    }
  };
}

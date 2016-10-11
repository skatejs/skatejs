const longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
let timeoutDuration = 0;
for (let i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microTaskDebounce(cbFunc) {
  let called = false;
  let i = 0;
  let cbArgs = [];
  const elem = document.createElement('span');
  const observer = new MutationObserver(() => {
    cbFunc(...cbArgs);
    called = false;
    cbArgs = null;
  });

  observer.observe(elem, { childList: true });

  return (...args) => {
    cbArgs = args;
    if (!called) {
      called = true;
      elem.textContent = `${i}`;
      i += 1;
    }
  };
}

function taskDebounce(fn) {
  let called = false;
  return (...args) => {
    if (!called) {
      called = true;
      setTimeout(() => {
        called = false;
        fn(...args);
      }, timeoutDuration);
    }
  };
}

export default window.MutationObserver ? microTaskDebounce : taskDebounce;

const { MutationObserver } = window;

export default function (cbFunc) {
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

export default function debounce(cbFunc) {
  let called = false;
  let cbArgs = [];
  const txt = document.createElement('span');
  const mut = new MutationObserver(() => {
    cbFunc(...cbArgs);
    cbArgs = [];
    called = false;
  });

  mut.observe(txt, { childList: true });

  return function debounced(...args) {
    cbArgs = args;
    if (!called) {
      called = true;
      txt.textContent = txt.textContent === '0' ? '1' : '0';
    }
  };
}

const div = () => document.createElement('div');

function observe(func, opts) {
  const el = div();
  const mo = new MutationObserver(func);
  mo.observe(el, opts);
  return { el, mo };
}

test('childList', done => {
  const { el } = observe(
    muts => {
      expect(Array.isArray(muts)).toBe(true);
      done();
    },
    {
      childList: true
    }
  );
  el.appendChild(div());
});

test('childList - textContent (batched)', done => {
  let called = 0;
  const { el } = observe(() => ++called, { childList: true });
  el.textContent = 'test1';
  el.textContent = 'test2';
  setTimeout(() => {
    expect(called).toBe(1);
    done();
  });
});

test('timing', () => {
  let called = 0;
  const { el } = observe(() => ++called, { childList: true });
  el.textContent = 'test1';
  el.textContent = 'test2';
  return Promise.resolve().then(() => {
    expect(called).toBe(1);
  });
});

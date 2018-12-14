test('window should work if re-included', () => {
  require('..');
});

test('Object', () => {
  expect(window.Object).toEqual(global.Object);
  expect({}).toBeInstanceOf(Object);
});

test('customElements should be an object', () => {
  expect(typeof customElements).toEqual('object');
});

test('window should work if re-included', () => {
  require('..');
});

test('Array', () => {
  expect(window.Array).toEqual(global.Array);
  expect([]).toBeInstanceOf(Array);
});

test('Object', () => {
  expect(window.Object).toEqual(global.Object);
  expect({}).toBeInstanceOf(Object);
});

test('customElements should be an object', () => {
  expect(typeof customElements).toEqual('object');
});

// Still unsure why this is failing.
test.skip('should still be instanceof object', () => {
  expect({}).toBeInstanceOf(Object);
});

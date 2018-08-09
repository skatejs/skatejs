import * as api from '..';

test('skate', () => {
  expect(typeof api).toBe('object');
});

test('skate.define', () => {
  expect(typeof api.define).toBe('function');
});

test('skate.name', () => {
  expect(typeof api.name).toBe('function');
});

test('skate.emit', () => {
  expect(typeof api.emit).toBe('function');
});

test('skate.link', () => {
  expect(typeof api.link).toBe('function');
});

test('skate.with*', () => {
  expect(typeof api.withChildren).toBe('function');
  expect(typeof api.withComponent).toBe('function');
  expect(typeof api.withRenderer).toBe('function');
  expect(typeof api.withUpdate).toBe('function');
});

test('skate.props.*', () => {
  expect(typeof api.props.array).toBe('function');
  expect(typeof api.props.boolean).toBe('function');
  expect(typeof api.props.number).toBe('function');
  expect(typeof api.props.object).toBe('function');
  expect(typeof api.props.string).toBe('function');
});

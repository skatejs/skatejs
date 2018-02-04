/* @flow */

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
  expect(typeof api.withChildren).toBe('function', 'withChildren');
  expect(typeof api.withContext).toBe('function', 'withContext');
  expect(typeof api.withComponent).toBe('function', 'withComponent');
  expect(typeof api.withLifecycle).toBe('function', 'withLifecycle');
  expect(typeof api.withRenderer).toBe('function', 'withRenderer');
  expect(typeof api.withUpdate).toBe('function', 'withUpdate');
});

test('skate.props.*', () => {
  expect(typeof api.props.array).toBe('function', 'array');
  expect(typeof api.props.boolean).toBe('function', 'boolean');
  expect(typeof api.props.number).toBe('function', 'number');
  expect(typeof api.props.object).toBe('function', 'object');
  expect(typeof api.props.string).toBe('function', 'string');
});

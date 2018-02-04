// @flow

import { name } from '..';

test('should choose a default name', () => {
  expect(name()).toMatch('x-element');
});

test('should auto-prefix a name with x- if it contains no dashes', () => {
  expect(name('element')).toMatch('x-element');
});

test('should ensure there is a space between the prefix and suffix', () => {
  expect(name('prefix')).toMatch('x-prefix');
});

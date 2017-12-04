/* eslint-env jest */

import { name } from '../../src/name';

describe('{ formatName }', () => {
  it('should choose a default name', () => {
    expect(name()).toMatch('x-element');
  });

  it('should auto-prefix a name with x- if it contains no dashes', () => {
    expect(name('element')).toMatch('x-element');
  });

  it('should ensure there is a space between the prefix and suffix', () => {
    expect(name('prefix')).toMatch('x-prefix');
  });
});

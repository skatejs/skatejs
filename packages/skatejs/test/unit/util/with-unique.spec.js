/* eslint-env jest */

import { formatName } from '../../../src/util/with-unique';

describe('{ formatName }', () => {
  it('should choose a default name', () => {
    expect(formatName()).toBe('x-element');
  });

  it('should auto-prefix a name with x- if it contains no dashes', () => {
    expect(formatName('element')).toBe('x-element');
  });

  it('should ensure there is a space between the prefix and suffix', () => {
    expect(formatName('prefix', 'suffix')).toBe('x-prefix-suffix');
  });
});

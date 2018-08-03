/* eslint-env jest */

import { dashCase, debounce, keys } from '../../src/util';

describe('utils', () => {
  describe('{ dashCase }', () => {
    it('should dash-case a camelCased attribute', () => {
      expect(dashCase('someCamelCasedString')).toEqual(
        'some-camel-cased-string'
      );
    });

    it('should ensure the first character is lowercase if passed a CamelCapped string', () => {
      expect(dashCase('SomeCamelCappedString')).toEqual(
        'some-camel-capped-string'
      );
    });

    it('should not do anything if no uppercase characters are found', () => {
      expect(dashCase('someunreadablestring')).toEqual('someunreadablestring');
    });

    it('should not affect a string that is already dash-cased', () => {
      expect(dashCase('some-dash-cased-string')).toEqual(
        'some-dash-cased-string'
      );
    });

    it('should treat underscores as separators dashes', () => {
      expect(dashCase('some_string')).toBe('some-string');
    });
  });

  describe('{ keys }', () => {
    it('should accept falsy arguments', () => {
      const empty = [];
      expect(keys()).toMatchObject(empty);
      expect(keys('')).toMatchObject(empty);
      expect(keys(0)).toMatchObject(empty);
      expect(keys(null)).toMatchObject(empty);
      expect(keys(undefined)).toMatchObject(empty);
    });

    it('should return both normal keys and symbol keys from an object', () => {
      const _sym = Symbol('_sym');
      const names = keys({ foo: 1, [_sym]: 2 });
      expect(names[0]).toBe('foo');
      expect(names[1]).toBe(_sym);
    });
  });
});

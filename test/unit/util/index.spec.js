/* eslint-env mocha */

import expect from 'expect';

import { dashCase, debounce, keys, sym, uniqueId } from 'src/util';

describe('utils', () => {
  describe('{ dashCase }', () => {
    it('should dash-case a camelCased attribute', () => {
      expect(dashCase('someCamelCasedString')).toEqual('some-camel-cased-string');
    });

    it('should ensure the first character is lowercase if passed a CamelCapped string', () => {
      expect(dashCase('SomeCamelCappedString')).toEqual('some-camel-capped-string');
    });

    it('should not do anything if no uppercase characters are found', () => {
      expect(dashCase('someunreadablestring')).toEqual('someunreadablestring');
    });

    it('should not affect a string that is already dash-cased', () => {
      expect(dashCase('some-dash-cased-string')).toEqual('some-dash-cased-string');
    });

    it('should treat underscores as separators dashes', () => {
      expect(dashCase('some_string')).toBe('some-string');
    });
  });

  describe('{ debounce }', () => {
    it('should be called only once', (done) => {
      let i = 0;
      const debounced = debounce(() => (i++));
      debounced();
      debounced();
      debounced();
      setTimeout(() => {
        expect(i).toEqual(1, 'debounce is called only once');
        done();
      }, 1);
    });

    it('should be called with the correct arguments', (done) => {
      let arg;
      const debounced = debounce((x) => (arg = x));
      debounced(1);
      debounced(2);
      debounced(3);
      setTimeout(() => {
        expect(arg).toEqual(3, 'debounce is called with the last argument');
        done();
      }, 1);
    });
  });

  describe('{ keys }', () => {
    it('should return both normal keys and symbol keys from an object', () => {
      const _sym = sym('_sym');
      const names = keys({ foo: 1, [_sym]: 2 });
      expect(names[0]).toBe('foo');
      expect(names[1]).toBe(_sym);
    });
  });

  describe('{ sym }', () => {
    it('should return a new symbol when supported', () => {
      const _sym = sym('test');
      if (typeof Symbol === 'function') {
        expect(_sym).toBeA('symbol');
      } else {
        expect(_sym).toBeA('string');
      }
    });
  });

  describe('{ unqiueId }', () => {
    it('should be relatively unique', () => {
      const ids = [];
      for (let a = 0; a < 1000; a++) {
        const id = uniqueId();
        expect(ids.indexOf(id)).toBe(-1);
        ids.push(id);
      }
    });

    it('should be relatively unique (length = 8)', () => {
      const ids = [];
      for (let a = 0; a < 1000; a++) {
        const id = uniqueId().substring(0, 8);
        expect(ids.indexOf(id)).toBe(-1);
        ids.push(id);
      }
    });
  });
});

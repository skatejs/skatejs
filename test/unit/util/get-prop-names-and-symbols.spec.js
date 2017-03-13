/* eslint-env mocha */

import expect from 'expect';

import namesAndSymbols from 'src/util/get-prop-names-and-symbols';
import createSymbol from 'src/util/create-symbol';

describe('utils/get-prop-names-and-symbols:', () => {
  it('should return both normal keys and symbol keys from an object', () => {
    const symb = createSymbol('symb');
    const keys = namesAndSymbols({ foo: 1, [symb]: 2 });
    expect(keys[0]).toBe('foo');
    expect(keys[1]).toBe(symb);
  });
});

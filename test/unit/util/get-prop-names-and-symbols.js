/* eslint-env jasmine, mocha */

import namesAndSymbols from '../../../src/util/get-prop-names-and-symbols';
import createSymbol from '../../../src/util/create-symbol';

describe('utils/get-prop-names-and-symbols:', () => {
  it('should return normal keys from an object', () =>
    expect(namesAndSymbols({ foo: 1, bar: 2 })).to.deep.equal(['foo', 'bar'])
  );

  it('should return symbol keys from an object', () => {
    const secret = createSymbol('secret');
    expect(namesAndSymbols({ foo: 1, [secret]: 2 })).to.deep.equal(['foo', secret]);
  });
});

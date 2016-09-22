import createSymbol from '../../../src/util/create-symbol';

describe('utils/create-symbol:', () => {
  it('should return a new symbol when supported', () => {
    const symbol = createSymbol('test');
    if (typeof window.Symbol === 'function') {
      expect(symbol).to.be.a('symbol');
    } else {
      expect(symbol).to.be.a('string');
    }
  });
});

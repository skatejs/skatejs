import keys from '../../../src/util/get-all-keys';
import createSymbol from '../../../src/util/create-symbol';

describe('utils/get-all-keys:', () => {
  it('should return normal keys from an object', () =>
    expect(keys({ foo: 1, bar: 2 })).to.deep.equal(['foo', 'bar'])
  );

  it('should return symbol keys from an object', () => {
    const secret = createSymbol('secret');
    expect(keys({ foo: 1, [secret]: 2 })).to.deep.equal(['foo', secret]);
  });

  describe('when enumOnly option is set', () => {
    let obj;
    beforeEach(() => {
      obj = {};
      Object.defineProperties(obj, {
        foo: { enumerable: true, value: 1 },
        bar: { enumerable: false, value: 2 },
      });
    });

    describe('to false (default)', () => {
      it('should return all keys', () =>
        expect(keys(obj, { enumOnly: false })).to.deep.equal(['foo', 'bar'])
      );
    });
    describe('to true', () => {
      it('should return enumerable keys only', () =>
        expect(keys(obj, { enumOnly: true })).to.deep.equal(['foo'])
      );
    });
  });
});

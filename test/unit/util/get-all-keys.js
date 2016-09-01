import keys from '../../../src/util/get-all-keys';

describe('utils/get-:', () => {
  it('should return normal keys from an object', () =>
    expect(keys({ foo: 1, bar: 2 }))
      .to.have.lengthOf(2)
      .and.to.deep.equal(['foo', 'bar'])
  );

  it('should return symbol keys from an object', () => {
    const secret = typeof Symbol === 'function' ? Symbol('secret') : 'secret';
    expect(keys({ foo: 1, [secret]: 2 }))
      .to.have.lengthOf(2)
      .and.to.deep.equal(['foo', secret]);
  });

  describe('when enumerable option is set', () => {
    const obj = {};
    beforeEach(() =>
      Object.defineProperties(obj, {
        foo: { enumerable: true, value: 1 },
        bar: { enumerable: false, value: 2 },
      })
    );

    describe('to false', () => {
      it('should not return enumerable keys', () =>
        expect(keys(obj)).to.have.lengthOf(1)
          .and.to.deep.equal(['foo'])
      );
    });
    describe('to true', () => {
      it('should return enumerable keys', () =>
        expect(keys(obj, { enumerable: true })).to.have.lengthOf(2)
          .and.to.deep.equal(['foo', 'bar'])
      );
    });
  });
});

import definePropertyConstructor from '../../../src/util/define-property-constructor';

describe('util/define-property-constructor', () => {
  let ctor;
  let obj;

  beforeEach(() => {
    ctor = () => {};
    obj = {};
    definePropertyConstructor(obj, ctor);
  });

  it('should define a constructor', () => {
    expect(obj.constructor).to.equal(ctor);
  });

  it('should be non-enumerable', () => {
    expect(Object.keys(obj).length).to.equal(0);
  });
});

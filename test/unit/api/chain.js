import skate from '../../../src/index';

describe('api/chain', function () {
  it('should call all functions', function () {
    let num = 0;
    let inc = () => ++num;
    skate.chain(inc, inc)();
    expect(num).to.equal(2);
  });

  it('should pass on the context', function () {
    let ctx = {};
    let obj = function () { expect(this).to.equal(ctx); };
    skate.chain(obj, obj).call(ctx);
  });

  it('should pass on the arguments', function () {
    let test = str => expect(str).to.equal('test');
    skate.chain(test, test)('test');
  });
});

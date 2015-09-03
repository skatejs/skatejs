import skate from '../../../src/index';

describe('api/compose', function () {
  it('should call all functions', function () {
    let num = 0;
    let inc = () => ++num;
    skate.compose(inc, inc)();
    expect(num).to.equal(2);
  });

  it('should pass on the context', function () {
    let ctx = {};
    let obj = function () { expect(this).to.equal(ctx); };
    skate.compose(obj, obj).call(ctx);
  });

  it('should allow the reducing of a value', function () {
    let comp = skate.compose(
      str => str + 'ri',
      str => str + 'ng'
    );
    expect(comp('st')).to.equal('string');
  });
});

import chain from '../../../src/api/chain';

describe('api/chain', function () {
  var ctx;

  beforeEach(function () {
    ctx = {
      calls: 0,
      method: function () {
        ++this.calls;
      }
    };
  });

  it('string', function () {
    var fn = chain('method', 'method')
    expect(fn.call(ctx).calls).to.equal(2);
  });

  it('function', function () {
    var fn = chain(ctx.method, ctx.method);
    expect(fn.call(ctx).calls).to.equal(2);
  });

  it('array', function () {
    var fn = chain([
      'method',
      ctx.method
    ]);

    expect(fn.call(ctx).calls).to.equal(2);
  });

  it('object', function () {
    var fn = chain(ctx, ctx);
    expect(fn.call(ctx).calls).to.equal(2);
  });
});

import skate from '../../../src/index';

describe('api/no-conflict', function () {
  it('should set window.skate to the previous window.skate value and return the current skate', function () {
    expect(window.skate).to.equal(skate);
    expect(skate.noConflict()).to.equal(skate);
    expect(window.skate).to.equal(undefined);
  });
});

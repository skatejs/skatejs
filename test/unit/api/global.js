import skate from '../../../src/global';

describe('when importing global.js', function () {
  it('window.skate should be defined as the skate module', function () {
    expect(window.skate).to.equal(skate);
  });

  describe('api/no-conflict', function () {
    it('should set window.skate to the previous window.skate value and return the current skate', function () {
      expect(window.skate).to.equal(skate);
      expect(skate.noConflict()).to.equal(skate);
      expect(window.skate).to.equal(undefined);
    });
  });
});

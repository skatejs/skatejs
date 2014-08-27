define(['src/skate'], function (skate) {
  'use strict';

  describe('version', function () {
    it('should be exposed', function () {
      skate.version.should.be.a('string');
    });
  });
});

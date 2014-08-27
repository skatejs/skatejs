define(['../../src/skate.js'], function (skate) {
  'use strict';

  describe('version', function () {
    it('should be exposed', function () {
      skate.version.should.be.a('string');
    });
  });
});

'use strict';

import skate from '../../src/index';

describe('version', function () {
  it('should be exposed', function () {
    expect(skate.version).to.be.a('string');
  });
});

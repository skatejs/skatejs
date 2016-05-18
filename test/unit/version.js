'use strict';

import { version } from '../../src/index';

describe('version', function () {
  it('should be exposed', function () {
    expect(version).to.be.a('string');
  });
});

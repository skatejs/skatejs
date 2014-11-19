'use strict';

import helpers from '../lib/helpers';
import skate from '../../src/skate';

describe('version', function () {
  it('should be exposed', function () {
    skate.version.should.be.a('string');
  });
});

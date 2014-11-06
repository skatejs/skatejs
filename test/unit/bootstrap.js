'use strict';

import helpers from '../lib/helpers';
import observer from '../../src/document-observer';
import registry from '../../src/registry';

afterEach(function () {
  observer.unregister();
  registry.clear();
  helpers.fixture('');
});

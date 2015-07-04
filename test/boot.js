'use strict';

import 'skatejs-polyfill-mutation-observer';
import helpers from './lib/helpers';
import observer from '../src/global/document-observer';
import typeAttribute from 'skatejs-type-attribute';
import typeClass from 'skatejs-type-class';

afterEach(function () {
  // Ensure perf tests have enough time to cleanup after themselves.
  this.timeout(120000);
  observer.unregister();
  helpers.fixture('');
});

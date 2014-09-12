import helpers from '../lib/helpers';
import skate from '../../src/skate';

afterEach(function () {
  skate.destroy();
  helpers.fixture('');
});

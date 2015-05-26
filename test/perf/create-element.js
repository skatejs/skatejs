import bench from '../lib/bench';
import apiCreate from '../../src/api/create';

describe('creating elements', function () {
  bench('document.createElement()', {
    fn: function () {
      document.createElement('div');
    }
  });

  bench('skate.create()', {
    fn: function () {
      apiCreate('div');
    }
  });
});

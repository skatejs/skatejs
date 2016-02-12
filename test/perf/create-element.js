import bench from '../lib/bench';
import apiCreate from '../../src/api/create';

describe('creating elements', function () {
  bench(`document.createElement()`, {
    fn () {
      document.createElement('div');
    }
  });

  bench('skate.create()', {
    fn () {
      apiCreate('div');
    }
  });
});

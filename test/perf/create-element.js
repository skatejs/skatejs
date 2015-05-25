import bench from '../lib/bench';
import nativeCreateElement from '../../src/util/native-create-element';
import polyfillCreateElement from '../../src/polyfill/create-element';

describe('skate.create()', function () {
  bench('native', {
    fn: function () {
      nativeCreateElement('div');
    }
  });

  bench('polyfill', {
    fn: function () {
      polyfillCreateElement('div');
    }
  });
});

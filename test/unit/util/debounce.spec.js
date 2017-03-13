/* eslint-env mocha */

import expect from 'expect';

import debounce from 'src/util/debounce';

describe('utils/debounce', () => {
  it('should be called only once', (done) => {
    let i = 0;
    const debounced = debounce(() => (i++));
    debounced();
    debounced();
    debounced();
    setTimeout(() => {
      expect(i).toEqual(1, 'debounce is called only once');
      done();
    }, 1);
  });

  it('should be called with the correct arguments', (done) => {
    let arg;
    const debounced = debounce((x) => (arg = x));
    debounced(1);
    debounced(2);
    debounced(3);
    setTimeout(() => {
      expect(arg).toEqual(3, 'debounce is called with the last argument');
      done();
    }, 1);
  });
});

/* eslint-env jasmine, mocha */

import emit from '../../../src/api/emit';
import fixture from '../../lib/fixture';

describe('api/emit', () => {
  it('default event options', done => {
    const elem = document.createElement('div');
    fixture(elem);
    elem.addEventListener('test', e => {
      expect(e.bubbles).to.equal(true);
      expect(e.cancelable).to.equal(true);
      expect(e.composed).to.equal(false);
      done();
    });
    emit(elem, 'test');
  });

  it('custom event options', done => {
    const elem = document.createElement('div');
    fixture(elem);
    elem.addEventListener('test', e => {
      expect(e.bubbles).to.equal(false);
      expect(e.cancelable).to.equal(false);
      expect(e.composed).to.equal(true);
      done();
    });
    emit(elem, 'test', {
      bubbles: false,
      cancelable: false,
      composed: true
    });
  });

  it('detail', done => {
    const elem = document.createElement('div');
    fixture(elem);
    const detail = {};
    elem.addEventListener('test', e => {
      expect(e.detail).to.equal(detail);
      done();
    });
    emit(elem, 'test', { detail });
  });
});

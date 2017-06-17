/* eslint-env jest */

import { emit } from '../../src';
import fixture from '../lib/fixture';

describe('api/emit', () => {
  it('default event options', done => {
    const elem = document.createElement('div');
    fixture(elem);
    elem.addEventListener('test', e => {
      expect(e.bubbles).toEqual(true);
      expect(e.cancelable).toEqual(true);
      expect(e.composed).toEqual(false);
      done();
    });
    emit(elem, 'test');
  });

  it('custom event options', done => {
    const elem = document.createElement('div');
    fixture(elem);
    elem.addEventListener('test', e => {
      expect(e.bubbles).toEqual(false);
      expect(e.cancelable).toEqual(false);
      expect(e.composed).toEqual(true);
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
      expect(e.detail).toEqual(detail);
      done();
    });
    emit(elem, 'test', { detail });
  });
});

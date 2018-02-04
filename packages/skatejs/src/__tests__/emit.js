// @flow
// @jsx h

import { mount } from '@skatejs/bore';
import { h } from '@skatejs/val';
import { emit } from '..';

describe('api/emit', () => {
  it('default event options', done => {
    const { node } = mount(<div />);
    node.addEventListener('test', e => {
      expect(e.bubbles).toEqual(true);
      expect(e.cancelable).toEqual(true);
      expect(e.composed).toEqual(false);
      done();
    });
    emit(node, 'test');
  });

  it('custom event options', done => {
    const { node } = mount(<div />);
    node.addEventListener('test', e => {
      expect(e.bubbles).toEqual(false);
      expect(e.cancelable).toEqual(false);
      expect(e.composed).toEqual(true);
      done();
    });
    emit(node, 'test', {
      bubbles: false,
      cancelable: false,
      composed: true
    });
  });

  it('detail', done => {
    const { node } = mount(<div />);
    const detail = {};
    node.addEventListener('test', e => {
      expect(e.detail).toEqual(detail);
      done();
    });
    emit(node, 'test', { detail });
  });
});

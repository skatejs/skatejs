/* eslint-env mocha */

import { h as preactH } from 'preact';
import { h } from 'src';
import expect from 'expect';

describe('api/Mixins', () => {
  it('should directly export h from preact', () => {
    expect(h).toEqual(preactH);
  });
});

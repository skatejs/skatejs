/* eslint-env jasmine, mocha */

import { Component, define } from '../../../src';

describe('vdom/shadow-dom', () => {
  let Elem;

  beforeEach(() => {
    Elem = define({
      renderCallback () {}
    });
  });

  it('should work for attachShadow()', () => {
    const elem = new Elem();
    expect(elem.shadowRoot).not.to.equal(elem);
  });
});

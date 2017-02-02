/* eslint-env jasmine, mocha */

import { define } from '../../../src';

const { HTMLElement } = window;

describe('vdom/shadow-dom', () => {
  let Elem;

  beforeEach(() => {
    Elem = define(class extends HTMLElement {
      renderCallback () {}
    });
  });

  it('should work for attachShadow()', () => {
    const elem = new Elem();
    expect(elem.shadowRoot).not.to.equal(elem);
  });
});

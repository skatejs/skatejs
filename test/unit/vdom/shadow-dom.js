/* eslint-env jasmine, mocha */

import { symbols } from '../../../src/index';
import element from '../../lib/element';

const { ShadowRoot } = window;

describe('vdom/shadow-dom', () => {
  let Elem;

  beforeEach(() => {
    Elem = element().skate({ render () {} });
  });

  it('should work for attachShadow()', () => {
    const elem = new Elem();
    if (elem.attachShadow) {
      expect(elem[symbols.shadowRoot]).not.to.equal(elem);
    } else {
      expect(elem[symbols.shadowRoot]).to.equal(elem);
    }
  });
});

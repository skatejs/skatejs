/* eslint-env jasmine, mocha */

import element from '../../lib/element';

describe('vdom/shadow-dom', () => {
  let Elem;

  beforeEach(() => {
    Elem = element().skate({ render () {} });
  });

  it('should work for attachShadow()', () => {
    const elem = new Elem();
    expect(elem.shadowRoot).not.to.equal(elem);
  });
});

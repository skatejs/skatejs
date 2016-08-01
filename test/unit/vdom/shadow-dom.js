import { shadowDomV0, shadowDomV1 } from '../../../src/util/support';
import { symbols } from '../../../src/index';
import element from '../../lib/element';

describe('vdom/shadow-dom', () => {
  let Elem;

  beforeEach(() => {
    Elem = element().skate({ render() {} });
  });

  if (shadowDomV0) {
    it('should work for createShadowRoot()', () => {
      const elem = new Elem();
      expect(elem[symbols.shadowRoot]).not.to.equal(elem);
    });
  }

  if (shadowDomV1) {
    it('should work for attachShadow()', () => {
      const elem = new Elem();
      expect(elem[symbols.shadowRoot]).not.to.equal(elem);
    });
  }

  if (!(shadowDomV0 || shadowDomV1)) {
    it('should set the shadowRoot to the element if Shadow DOM is not available', () => {
      const elem = new Elem();
      expect(elem[symbols.shadowRoot]).to.equal(elem);
    });
  }
});

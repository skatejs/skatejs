import { shadowDomV0, shadowDomV1 } from '../../../src/util/support';
import { symbols } from '../../../src/index';
import element from '../../lib/element';

describe('vdom/shadow-dom', function () {
  const oldShadowDom = {};
  const elProto = Element.prototype;
  const htmlElProto = HTMLElement.prototype;

  function mock (key) {
    remove('attachShadow');
    remove('createShadowRoot');
    htmlElProto[key] = () => document.createElement('__mock_shadow_root__');
  }

  function unmock () {
    restore('attachShadow');
    restore('createShadowRoot');
  }

  function remove (key) {
    oldShadowDom[key] = elProto[key] || htmlElProto[key];
    Object.defineProperty(elProto, key, { value: undefined, writable: true });
    Object.defineProperty(htmlElProto, key, { value: undefined, writable: true });
  }

  function restore (key) {
    Object.defineProperty(elProto, key, { value: oldShadowDom[key], writable: true });
    Object.defineProperty(htmlElProto, key, { value: oldShadowDom[key], writable: true });
  }

  let Elem;

  beforeEach(function () {
    Elem = element().skate({ render () {} });
  });

  shadowDomV0 && it('should work for createShadowRoot()', function () {
    const elem = new Elem();
    expect(elem[symbols.$shadowRoot]).not.to.equal(elem);
  });

  shadowDomV1 && it('should work for attachShadow()', function () {
    const elem = new Elem();
    expect(elem[symbols.$shadowRoot]).not.to.equal(elem);
  });

  shadowDomV0 || shadowDomV1 || it('should set the shadowRoot to the element if Shadow DOM is not available', function () {
    const elem = new Elem();
    expect(elem[symbols.$shadowRoot]).to.equal(elem);
  });
});

import { symbols } from '../../../src/index';
import element from '../../lib/element';

describe('vdom/shadow-dom', function () {
  let shadowRoot;

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

  it('should work for attachShadow()', function () {
    mock('attachShadow');
    const elem = element().skate({ render () {} })();
    expect(elem.attachShadow).to.be.a('function');
    expect(elem.createShadowRoot).to.equal(undefined);
    expect(elem[symbols.shadowRoot].tagName).to.equal('__MOCK_SHADOW_ROOT__');
    unmock('attachShadow');
  });

  it('should work with createShadowRoot()', function () {
    mock('createShadowRoot');
    const elem = element().skate({ render () {} })();
    expect(elem.attachShadow).to.equal(undefined);
    expect(elem.createShadowRoot).to.be.a('function');
    expect(elem[symbols.shadowRoot].tagName).to.equal('__MOCK_SHADOW_ROOT__');
    unmock('createShadowRoot');
  });

  it('should set the shadowRoot to the element if Shadow DOM is not available', function () {
    remove('attachShadow');
    remove('createShadowRoot');
    const elem = element().skate({ render () {} })();
    expect(elem.attachShadow).to.equal(undefined);
    expect(elem.createShadowRoot).to.equal(undefined);
    expect(elem[symbols.shadowRoot]).to.equal(elem);
    restore('createShadowRoot');
    restore('attachShadow');
  });
});

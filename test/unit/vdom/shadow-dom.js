import skate from '../../../src/index';

describe('vdom/shadow-dom', function () {
  let div;
  let oldShadowDom;

  const elProto = Element.prototype;
  const htmlElProto = HTMLElement.prototype;

  function remove (key) {
    oldShadowDom = elProto[key] || htmlElProto[key];
    Object.defineProperty(elProto, key, { value: undefined, writable: true });
    Object.defineProperty(htmlElProto, key, { value: undefined, writable: true });
  }

  function restore (key) {
    Object.defineProperty(elProto, key, { value: oldShadowDom, writable: true });
    Object.defineProperty(htmlElProto, key, { value: oldShadowDom, writable: true });
  }

  beforeEach(function () {
    div = document.createElement('div');
  });

  it('should work for attachShadow()', function () {
    remove('createShadowRoot');

    expect(div.attachShadow).to.be.a('function');
    expect(div.createShadowRoot).to.equal(undefined);

    restore('createShadowRoot');
  });

  it('should work with createShadowRoot()', function () {
    remove('attachShadow');

    expect(div.attachShadow).to.equal(undefined);
    expect(div.createShadowRoot).to.be.a('function');

    restore('attachShadow');
  });

  it('should warn if no shadow root is available', function () {
    remove('attachShadow');
    remove('createShadowRoot');

    expect(div.attachShadow).to.equal(undefined);
    expect(div.createShadowRoot).to.equal(undefined);

    restore('createShadowRoot');
    restore('attachShadow');
  });
});

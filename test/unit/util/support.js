import { shouldUseShadowDomV0, shouldUseShadowDomV1 } from '../../../src/util/support';
import { v0ShadowDOMProperty, v1ShadowDOMProperty } from '../../../src/api/symbols';

describe('util/support', () => {
  describe('shadowDOM', () => {
    const nativeProperty = Object.getOwnPropertyDescriptor(Element.prototype, 'getAttribute');
    const polyfilledProperty = { value: () => {}};

    let obj;

    expect(nativeProperty).to.be.defined;

    beforeEach(() => {
      obj = {};
    });

    it('v0 native, v1 native', () => {
      Object.defineProperty(obj, v0ShadowDOMProperty, nativeProperty);
      Object.defineProperty(obj, v1ShadowDOMProperty, nativeProperty);

      expect(shouldUseShadowDomV0(obj)).to.equal(false);
      expect(shouldUseShadowDomV1(obj)).to.equal(true);
    });
    it('v0 native, v1 polyfilled', () => {
      Object.defineProperty(obj, v0ShadowDOMProperty, nativeProperty);
      Object.defineProperty(obj, v1ShadowDOMProperty, polyfilledProperty);

      expect(shouldUseShadowDomV0(obj)).to.equal(true);
      expect(shouldUseShadowDomV1(obj)).to.equal(false);
    });
    it('v0 polyfilled, v1 native', () => {
      Object.defineProperty(obj, v0ShadowDOMProperty, polyfilledProperty);
      Object.defineProperty(obj, v1ShadowDOMProperty, nativeProperty);

      expect(shouldUseShadowDomV0(obj)).to.equal(false);
      expect(shouldUseShadowDomV1(obj)).to.equal(true);
    });
    it('v0 polyfilled, v1 polyfilled', () => {
      Object.defineProperty(obj, v0ShadowDOMProperty, polyfilledProperty);
      Object.defineProperty(obj, v1ShadowDOMProperty, polyfilledProperty);

      expect(shouldUseShadowDomV0(obj)).to.equal(false);
      expect(shouldUseShadowDomV1(obj)).to.equal(true);
    });
  });  
});


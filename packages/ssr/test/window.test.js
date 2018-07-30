require('./_');

describe('window', () => {
  it('should work if re-included', () => {
    require('..');
  });

  it('Object', () => {
    expect(window.Object).toBeDefined();
    expect(window.Object).toEqual(global.Object);
  });

  describe('customElements', () => {
    it('should be an object', () => {
      expect(typeof window.customElements).toEqual('object');
    });

    it('define should add a the nodeName to the customElement', () => {
      expect(CustomElement.prototype.nodeName.toLowerCase()).toEqual(
        'custom-element'
      );
    });

    it('get should return the custom element', () => {
      expect(window.customElements.get('custom-element')).toEqual(
        CustomElement
      );
    });

    it('whenDefined is a function', () => {
      expect(typeof customElements.whenDefined).toBe('function');
    });

    it('whenDefined fires if already defined', () => {
      customElements.define('x-testwhendefined1', class extends HTMLElement {});
      return customElements.whenDefined('x-testwhendefined1');
    });

    it('whenDefined fires when eventually defined', () => {
      const promise = customElements.whenDefined('x-testwhendefined2');
      setTimeout(() => {
        customElements.define(
          'x-testwhendefined2',
          class extends HTMLElement {}
        );
      });
      return promise;
    });
  });
});

describe('Node', () => {
  let host;

  beforeEach(() => {
    host = document.createElement('div');
  });

  describe('appendChild', () => {
    let m1, m2;

    it('should connect a custom element', () => {
      const node = document.createElement('custom-element');
      node.connectedCallback = jest.fn();
      host.appendChild(node);
      expect(node.connectedCallback.mock.calls.length).toEqual(1);
    });

    it('should connect a fragment of elements', () => {});
  });

  describe('insertBefore', () => {
    it('should connect a custom element', () => {});

    it('should connect a fragment of elements', () => {});
  });

  describe('removeChild', () => {
    it('should connect a custom element', () => {});

    it('should connect a fragment of elements', () => {});
  });

  describe('replaceChild', () => {
    it('should connect a custom element', () => {});

    it('should connect a fragment of elements', () => {});
  });
});

describe('Node', () => {
  let host;

  beforeEach(() => {
    host = document.createElement('div');
  });

  describe('appendChild', () => {
    let m1, m2;

    // For some reason this test has side effects and fails ever other run.
    it.skip('should connect a custom element', () => {
      class CustomElement extends HTMLElement {
        constructor() {
          super();
          this.connectedCallback = jest.fn();
        }
      }
      const node = new CustomElement();
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

  describe('cloneNode', () => {
    function testCloneEquality(source, clone, deeplyCloned) {
      expect(clone.nodeName).toEqual(source.nodeName);

      if (clone.attributes) {
        clone.attributes.forEach(({ name, value }) =>
          expect(value).toEqual(source.getAttribute(name))
        );
      }

      expect(clone.nodeType).toEqual(source.nodeType);

      if (deeplyCloned) {
        expect(clone.textContent).toEqual(source.textContent);

        expect(clone.childNodes.length).toEqual(source.childNodes.length);
        if (clone.childNodes) {
          clone.childNodes.forEach((child, i) => {
            testCloneEquality(source.childNodes[i], child, true);
          });
        }
      } else {
        expect(clone.childNodes.length).toEqual(0);
      }
    }

    beforeEach(() => {
      const child = document.createElement('span');
      child.setAttribute('clone-this', 'test');
      child.appendChild(document.createTextNode('example text child'));
      const grandchild = document.createElement('div');
      grandchild.setAttribute('id', '42');
      grandchild.appendChild(document.createTextNode('grandchild text node'));
      child.appendChild(grandchild);

      host.appendChild(child);
      host.setAttribute('clone-this', 'test');
    });

    it('clones an element shallowly', () => {
      const clone = host.cloneNode();
      testCloneEquality(host, clone, false);
    });

    it('clones an element deeply', () => {
      const clone = host.cloneNode(true);
      testCloneEquality(host, clone, true);
    });
  });

  describe('content', () => {
    it('should return a documentFragment containing all children', () => {
      for (let i = 0; i < 10; i++) {
        const child = document.createElement('span');
        child.textContent = i;
        host.appendChild(child);
      }
      const content = host.content;
      expect(content.childNodes.length).toEqual(10);
      for (let i = 0; i < 10; i++) {
        expect(content.childNodes[i].textContent).toEqual(i.toString());
      }
    });
  });

  describe('textContent', () => {
    it('should get textContent', () => {
      const text = 'Hello Bob!';
      const div = document.createElement('div');
      div.appendChild(document.createTextNode(text));
      expect(div.textContent).toEqual(text);
    });

    it('should set textContent', () => {
      const div = document.createElement('div');
      const text = `Hello World!`;
      div.textContent = text;
      expect(div.textContent).toEqual(text);

      const newText = `Hello Bob!`;
      div.textContent = newText;
      expect(div.textContent).toEqual(newText);
    });
  });
});

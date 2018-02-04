/** @jsx h */
/* eslint-env jest */

const { mount } = require('..');
const { h } = require('@skatejs/val');
const {
  customElements,
  DocumentFragment,
  HTMLElement,
  Promise,
  Event,
  CustomEvent
} = window;
const hasCustomElements = 'customElements' in window;
const hasQuerySelector = 'querySelector' in Element.prototype;

function empty(value) {
  expect(value == null).toEqual(true);
}

describe('bore', () => {
  // This isn't implemented in some server-side DOM environments.
  hasQuerySelector &&
    it('mount: all(string)', () => {
      const div = mount(
        <div>
          <span id="test1">test1</span>
          <span id="test2">test2</span>
        </div>
      );
      expect(div.all('div').length).toEqual(0);
      expect(div.all('span').length).toEqual(2);
      expect(div.all('#test1').length).toEqual(1);
      expect(div.all('#test2').length).toEqual(1);
      expect(div.all('#test3').length).toEqual(0);
    });

  it('mount: all(node)', () => {
    const div = mount(
      <div>
        <span id="test1">test1</span>
        <span id="test2">test2</span>
      </div>
    );
    expect(div.all(<div />).length).toEqual(0);
    expect(div.all(<span />).length).toEqual(0);
    expect(div.all(<span id="test1" />).length).toEqual(0);
    expect(div.all(<span id="test1">test1</span>).length).toEqual(1);
    expect(div.all(<span id="test2">test2</span>).length).toEqual(1);
    expect(div.all(<span id="test3">test3</span>).length).toEqual(0);
  });

  it('mount: all(object)', () => {
    const div = mount(
      <div>
        <span id="test1">test1</span>
        <span id="test2">test2</span>
      </div>
    );
    expect(div.all({}).length).toEqual(0);
    expect(div.all({ nodeName: 'TEST1' }).length).toEqual(0);
    expect(div.all({ id: 'test1' }).length).toEqual(1);
    expect(div.all({ id: 'test2' }).length).toEqual(1);
    expect(div.all({ id: 'test3' }).length).toEqual(0);
  });

  it('mount: all(function)', () => {
    const div = mount(
      <div>
        <span id="test1">test1</span>
        <span id="test2">test2</span>
      </div>
    );
    expect(div.all(n => n.nodeName === 'SPAN').length).toEqual(2);
  });

  it('mount: has', () => {
    expect(
      mount(
        <div>
          <span />
        </div>
      ).has(<span />)
    ).toEqual(true);
  });

  it('mount: one', () => {
    expect(
      mount(
        <div>
          <span />
        </div>
      ).one(<span />).node.nodeName
    ).toEqual('SPAN');
  });

  it('mount(string)', () => {
    expect(
      mount('<div><span></span></div>').has({ localName: 'span' })
    ).toEqual(true);
  });

  hasCustomElements &&
    it('mount(node): should descend into custom elements', () => {
      class Test extends HTMLElement {
        connectedCallback() {
          this.attachShadow({ mode: 'open' });
          this.shadowRoot.innerHTML = '<span></span>';
        }
      }
      customElements.define('x-test-1', Test);
      expect(mount(<Test />).has({ localName: 'span' })).toBe(true);
    });

  hasCustomElements &&
    it('mount(string): should descend into custom elements', () => {
      class Test extends HTMLElement {
        connectedCallback() {
          if (!this.shadowRoot) {
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = '<span></span>';
          }
        }
      }
      customElements.define('x-test-2', Test);
      expect(mount('<x-test-2></x-test-2>').has({ localName: 'span' })).toBe(
        true
      );
    });
});

describe('then()', () => {
  it('should be a function', () => {
    expect(typeof mount(<div />).wait).toEqual('function');
  });

  it('should take no arguments', () => {
    expect(() => mount(<div />).wait()).not.toThrow();
  });

  it('should return a Promise', () => {
    expect(mount(<div />).wait()).toBeInstanceOf(Promise);
  });

  hasCustomElements &&
    it('should wait for a shadowRoot', () => {
      class MyElement extends HTMLElement {
        connectedCallback() {
          setTimeout(() => {
            this.attachShadow({ mode: 'open' });
          }, 100);
        }
      }
      customElements.define('x-test-2', MyElement);
      const wrapper = mount(<MyElement />);
      return wrapper.wait(wrapperInPromise => {
        expect(wrapperInPromise).toEqual(wrapper);
        expect(wrapperInPromise.node.shadowRoot).toBeInstanceOf(Node);
      });
    });
});

describe('waitFor', () => {
  it('should be a function', () => {
    expect(typeof mount(<div />).waitFor).toEqual('function');
  });

  it('should return a Promise', () => {
    expect(mount(<div />).waitFor(() => {})).toBeInstanceOf(Promise);
  });

  hasCustomElements &&
    it('should wait for a user-defined function to return true', () => {
      class MyElement extends HTMLElement {
        connectedCallback() {
          setTimeout(() => {
            this.done = true;
          }, 100);
        }
      }
      customElements.define('x-test-3', MyElement);
      const wrapper = mount(<MyElement />);
      return wrapper.waitFor(wrap => wrap.node.done).then(wrapperInPromise => {
        expect(wrapperInPromise).toEqual(wrapper);
        expect(wrapperInPromise.node.done).toEqual(true);
      });
    });
});

test('#22 - shallow', () => {
  expect(mount('<div><p><a /></p></div>').has({ localName: 'a' })).toBe(true);
});

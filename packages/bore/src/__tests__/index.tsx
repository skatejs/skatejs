import { h } from '@skatejs/val';
import mount from '..';

// @ts-ignore
const { customElements, HTMLElement, Promise } = window;
const hasCustomElements = 'customElements' in window;
const hasQuerySelector = 'querySelector' in Element.prototype;

// This isn't implemented in some server-side DOM environments.
hasQuerySelector &&
  test('mount: all(string)', () => {
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
  expect(mount('<div><span></span></div>').has({ localName: 'span' })).toEqual(
    true
  );
});

hasCustomElements &&
  it('mount(node): should descend into custom elements', () => {
    class Test extends HTMLElement {
      connectedCallback() {
        // @ts-ignore
        this.attachShadow({ mode: 'open' });
        // @ts-ignore
        this.shadowRoot.innerHTML = '<span></span>';
      }
    }
    customElements.define('x-test-1', Test);
    // @ts-ignore
    expect(mount(<Test />).has({ localName: 'span' })).toBe(true);
  });

hasCustomElements &&
  it('mount(string): should descend into custom elements', () => {
    class Test extends HTMLElement {
      connectedCallback() {
        // @ts-ignore
        if (!this.shadowRoot) {
          // @ts-ignore
          this.attachShadow({ mode: 'open' });
          // @ts-ignore
          this.shadowRoot.innerHTML = '<span></span>';
        }
      }
    }
    customElements.define('x-test-2', Test);
    expect(mount('<x-test-2></x-test-2>').has({ localName: 'span' })).toBe(
      true
    );
  });

hasCustomElements &&
  it.skip('should wait for a shadowRoot', () => {
    class MyElement extends HTMLElement {
      connectedCallback() {
        setTimeout(() => {
          // @ts-ignore
          this.attachShadow({ mode: 'open' });
        }, 100);
      }
    }

    customElements.define('x-test-2', MyElement);

    // @ts-ignore
    const wrapper = mount(<MyElement />);
    return wrapper.wait(wrapperInPromise => {
      expect(wrapperInPromise).toEqual(wrapper);
      expect(wrapperInPromise.node.shadowRoot).toBeInstanceOf(Node);
    });
  });

hasCustomElements &&
  it('waitFor: should wait for a user-defined function to return true', async () => {
    class MyElement extends HTMLElement {
      done: boolean = false;
      connectedCallback() {
        setTimeout(() => {
          this.done = true;
        }, 100);
      }
    }

    customElements.define('x-test-3', MyElement);

    // @ts-ignore
    const wrapper = mount(<MyElement />);
    return wrapper
      .waitFor(wrap => wrap.node.done)
      .then(wrapperInPromise => {
        expect(wrapperInPromise).toEqual(wrapper);
        expect(wrapperInPromise.node.done).toEqual(true);
      });
  });

test('#22 - shallow', () => {
  expect(mount('<div><p><a /></p></div>').has({ localName: 'a' })).toBe(true);
});

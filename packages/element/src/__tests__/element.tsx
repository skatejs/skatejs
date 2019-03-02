import mount, { wait } from '@skatejs/bore';
import define, { getName } from '@skatejs/define';
import Element, { props } from '..';

// This test isn't completely necessary at this point because we don't yet
// offer a mixin to insert above the prototype chain of Component, but it
// is possible for an element to be given a shadow root prior to being
// constructed, so this takes care of two cases:
//
// 1. Where a parent constructor attaches a shadow root before Component
//    (mixin).
// 2. Where a custom element is created and a shadow root is attached prior to
//    being defined.
test('checks for existing shadow root', () => {
  class Elem extends Element {
    // We can't initialize this to false because it will be initialized
    // *after* the constructor is invoked, thus after attachShadow would
    // be called and give us a false positive.
    called: boolean;

    // We must return a shadow root, but we can't "new" one, so we have
    // to use a dummy one.
    get shadowRoot() {
      return document.createElement('div').attachShadow({ mode: 'open' });
    }

    // We override this to spy on if it's called.
    attachShadow(opts) {
      this.called = true;
      return super.attachShadow(opts);
    }
  }

  // The shadow root attachment happens in the constructor.
  const e = new Elem();

  // Since we can't initialize `called` to false, we must check `undefined`.
  expect(e.called).toEqual(undefined);
});

test('reflects initial attribute values to props', () => {
  const name = getName(
    define(
      class extends Element {
        static props = {
          test: Boolean
        };
      }
    )
  );

  const w = mount(`<${name} test></${name}>`);
  expect(w.node.test).toEqual(true);
});

test('reflects subsequent values to props', () => {
  const Elem = define(
    class extends Element {
      static props = {
        test: Boolean
      };
    }
  );

  const w = mount(new Elem());
  w.node.setAttribute('test', '');
  expect(w.node.test).toEqual(true);
});

test('does not reflect to attribute by default', async () => {
  const Elem = define(
    class extends Element {
      static props = {
        test: Boolean
      };
    }
  );

  const w = mount(new Elem());
  expect(w.node.getAttribute('test')).toEqual(null);

  w.node.test = true;
  await wait();
  expect(w.node.getAttribute('test')).toEqual(null);
});

test('reflects to attribute if target is supplied', async () => {
  const Elem = define(
    class extends Element {
      static props = {
        test: { ...props.boolean, target: 'test' }
      };
    }
  );

  const w = mount(new Elem());
  expect(w.node.getAttribute('test')).toEqual(null);

  w.node.test = true;
  await wait();
  expect(w.node.getAttribute('test')).toEqual('');
});
